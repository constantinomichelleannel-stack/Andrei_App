import express from "express";
import "dotenv/config";
import { createServer as createViteServer } from "vite";
import Database from "better-sqlite3";
import path from "path";
import { fileURLToPath } from "url";
import multer from "multer";
import fs from "fs";
import mammoth from "mammoth";
import archiver from "archiver";
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const pdf = require('pdf-parse');

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// Multer configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

const db = new Database("lexph.db");

// Initialize Database
db.exec(`
  CREATE TABLE IF NOT EXISTS notes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    content TEXT,
    category TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS documents (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    filename TEXT NOT NULL,
    title TEXT,
    type TEXT, -- 'case', 'statute', 'memo'
    citation TEXT,
    summary TEXT,
    tags TEXT, -- comma-separated tags
    size INTEGER,
    status TEXT DEFAULT 'completed', -- 'processing', 'completed', 'failed'
    citation_check TEXT, -- JSON string for citation analysis
    uploaded_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  -- Add citation column if it doesn't exist (for existing databases)
  PRAGMA table_info(documents);
`);

// Check if columns exist, if not add them
const tableInfo = db.prepare("PRAGMA table_info(documents)").all() as any[];
const columns = tableInfo.map(col => col.name);

if (!columns.includes('citation')) {
  db.exec("ALTER TABLE documents ADD COLUMN citation TEXT;");
}
if (!columns.includes('size')) {
  db.exec("ALTER TABLE documents ADD COLUMN size INTEGER;");
}
if (!columns.includes('status')) {
  db.exec("ALTER TABLE documents ADD COLUMN status TEXT DEFAULT 'completed';");
}
if (!columns.includes('citation_check')) {
  db.exec("ALTER TABLE documents ADD COLUMN citation_check TEXT;");
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes
  app.get("/api/notes", (req, res) => {
    const notes = db.prepare("SELECT * FROM notes ORDER BY created_at DESC").all();
    res.json(notes);
  });

  app.post("/api/notes", (req, res) => {
    const { title, content, category } = req.body;
    const info = db.prepare("INSERT INTO notes (title, content, category) VALUES (?, ?, ?)").run(title, content, category);
    res.json({ id: info.lastInsertRowid });
  });

  app.delete("/api/notes/:id", (req, res) => {
    db.prepare("DELETE FROM notes WHERE id = ?").run(req.params.id);
    res.json({ success: true });
  });

  app.get("/api/documents", (req, res) => {
    const docs = db.prepare("SELECT * FROM documents ORDER BY uploaded_at DESC").all();
    const formattedDocs = docs.map(doc => ({
      ...doc,
      tags: doc.tags ? doc.tags.split(',') : [],
      citation_check: doc.citation_check ? JSON.parse(doc.citation_check) : null
    }));
    res.json(formattedDocs);
  });

  app.post("/api/documents", upload.single("file"), async (req, res) => {
    const { title, type, tags, citation, summary: providedSummary, citation_check } = req.body;
    const file = req.file;

    if (!file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    try {
      // Generate a simple snippet/preview if no summary provided
      let summary = providedSummary;
      
      if (!summary) {
        const filePath = path.join(uploadDir, file.filename);
        const ext = path.extname(file.originalname).toLowerCase();
        if (['.txt', '.md', '.csv', '.json', '.html'].includes(ext)) {
          const content = fs.readFileSync(filePath, 'utf8');
          summary = content.substring(0, 200) + (content.length > 200 ? '...' : '');
        } else if (ext === '.pdf') {
          try {
            const dataBuffer = fs.readFileSync(filePath);
            const data = await pdf(dataBuffer);
            summary = data.text.substring(0, 200) + (data.text.length > 200 ? '...' : '');
          } catch (err) {
            console.error("PDF summary extraction failed:", err);
            summary = `Legal ${type || 'document'} uploaded: ${file.originalname}`;
          }
        } else if (ext === '.docx') {
          try {
            const dataBuffer = fs.readFileSync(filePath);
            const result = await mammoth.extractRawText({ buffer: dataBuffer });
            summary = result.value.substring(0, 200) + (result.value.length > 200 ? '...' : '');
          } catch (err) {
            console.error("DOCX summary extraction failed:", err);
            summary = `Legal ${type || 'document'} uploaded: ${file.originalname}`;
          }
        } else {
          summary = `Legal ${type || 'document'} uploaded: ${file.originalname}`;
        }
      }

      const info = db.prepare("INSERT INTO documents (filename, title, type, citation, summary, tags, size, status, citation_check) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)").run(
        file.filename,
        title || file.originalname,
        type || 'case',
        citation || '',
        summary,
        tags || '',
        file.size,
        'completed',
        citation_check || null
      );
      res.json({ id: info.lastInsertRowid, filename: file.filename, summary });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to save document metadata" });
    }
  });

  app.post("/api/documents/save-summary", async (req, res) => {
    const { title, citation, summary, facts, issues, ruling, analysis, tags } = req.body;

    if (!title || !summary) {
      return res.status(400).json({ error: "Title and summary are required" });
    }

    try {
      const content = `
# Case Summary: ${title}
**Citation:** ${citation || 'N/A'}

## Facts
${facts || 'N/A'}

## Issues
${issues || 'N/A'}

## Ruling
${ruling || 'N/A'}

## Legal Analysis
${analysis || 'N/A'}

---
Generated by LexPH AI Case Summarizer
      `;

      const filename = `summary-${Date.now()}.md`;
      const filePath = path.join(uploadDir, filename);
      fs.writeFileSync(filePath, content);

      const stats = fs.statSync(filePath);

      const info = db.prepare("INSERT INTO documents (filename, title, type, citation, summary, tags, size, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)").run(
        filename,
        title,
        'case',
        citation || '',
        summary.substring(0, 500) + (summary.length > 500 ? '...' : ''),
        tags || 'ai-generated,summary',
        stats.size,
        'completed'
      );

      res.json({ id: info.lastInsertRowid, filename });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to save summary" });
    }
  });

  app.get("/api/documents/download/:filename", (req, res) => {
    const filePath = path.join(uploadDir, req.params.filename);
    if (fs.existsSync(filePath)) {
      res.download(filePath);
    } else {
      res.status(404).json({ error: "File not found" });
    }
  });

  app.get("/api/documents/preview/:filename", async (req, res) => {
    const filePath = path.join(uploadDir, req.params.filename);
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: "File not found" });
    }

    const ext = path.extname(req.params.filename).toLowerCase();
    if (['.txt', '.md', '.csv', '.json', '.html'].includes(ext)) {
      try {
        const content = fs.readFileSync(filePath, 'utf8');
        res.json({ content });
      } catch (err) {
        res.status(500).json({ error: "Failed to read file" });
      }
    } else if (ext === '.pdf') {
      try {
        const dataBuffer = fs.readFileSync(filePath);
        const data = await pdf(dataBuffer);
        res.json({ content: data.text });
      } catch (err) {
        res.status(500).json({ error: "Failed to parse PDF" });
      }
    } else if (ext === '.docx') {
      try {
        const dataBuffer = fs.readFileSync(filePath);
        const result = await mammoth.extractRawText({ buffer: dataBuffer });
        res.json({ content: result.value });
      } catch (err) {
        res.status(500).json({ error: "Failed to parse DOCX" });
      }
    } else {
      res.status(400).json({ error: "Preview not supported for this file type" });
    }
  });

  app.delete("/api/documents/:id", (req, res) => {
    const doc = db.prepare("SELECT filename FROM documents WHERE id = ?").get(req.params.id);
    if (doc) {
      const filePath = path.join(uploadDir, doc.filename);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
      db.prepare("DELETE FROM documents WHERE id = ?").run(req.params.id);
    }
    res.json({ success: true });
  });

  app.post("/api/documents/batch-delete", (req, res) => {
    const { ids } = req.body;
    if (!Array.isArray(ids)) {
      return res.status(400).json({ error: "IDs must be an array" });
    }

    const deleteDoc = db.prepare("DELETE FROM documents WHERE id = ?");
    const getDoc = db.prepare("SELECT filename FROM documents WHERE id = ?");

    const transaction = db.transaction((ids) => {
      for (const id of ids) {
        const doc = getDoc.get(id);
        if (doc) {
          const filePath = path.join(uploadDir, doc.filename);
          if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
          }
          deleteDoc.run(id);
        }
      }
    });

    transaction(ids);
    res.json({ success: true });
  });

  app.post("/api/documents/batch-download", async (req, res) => {
    const { ids } = req.body;
    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ error: "IDs must be a non-empty array" });
    }

    const getDoc = db.prepare("SELECT filename, title FROM documents WHERE id = ?");
    const filesToZip: { path: string, name: string }[] = [];

    for (const id of ids) {
      const doc = getDoc.get(id) as any;
      if (doc) {
        const filePath = path.join(uploadDir, doc.filename);
        if (fs.existsSync(filePath)) {
          const ext = path.extname(doc.filename);
          const safeTitle = (doc.title || doc.filename).replace(/[/\\?%*:|"<>]/g, '-');
          filesToZip.push({ path: filePath, name: `${safeTitle}${ext}` });
        }
      }
    }

    if (filesToZip.length === 0) {
      return res.status(404).json({ error: "No files found to download" });
    }

    res.attachment('legal-documents.zip');
    const archive = archiver('zip', { zlib: { level: 9 } });

    archive.on('error', (err) => {
      console.error('Archive error:', err);
      if (!res.headersSent) {
        res.status(500).send({ error: err.message });
      }
    });

    archive.pipe(res);

    for (const file of filesToZip) {
      archive.file(file.path, { name: file.name });
    }

    await archive.finalize();
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "dist", "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`LexPH Server running on http://localhost:${PORT}`);
  });
}

startServer();
