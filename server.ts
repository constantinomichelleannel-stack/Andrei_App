import express from "express";
import "dotenv/config";
import { createServer as createViteServer } from "vite";
import Database from "better-sqlite3";
import path from "path";
import { fileURLToPath } from "url";
import multer from "multer";
import fs from "fs";

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
    summary TEXT,
    tags TEXT, -- comma-separated tags
    uploaded_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

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
      tags: doc.tags ? doc.tags.split(',') : []
    }));
    res.json(formattedDocs);
  });

  app.post("/api/documents", upload.single("file"), (req, res) => {
    const { title, type, tags, summary: providedSummary } = req.body;
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
        } else {
          summary = `Legal ${type || 'document'} uploaded: ${file.originalname}`;
        }
      }

      const info = db.prepare("INSERT INTO documents (filename, title, type, summary, tags) VALUES (?, ?, ?, ?, ?)").run(
        file.filename,
        title || file.originalname,
        type || 'case',
        summary,
        tags || ''
      );
      res.json({ id: info.lastInsertRowid, filename: file.filename, summary });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to save document metadata" });
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

  app.get("/api/documents/preview/:filename", (req, res) => {
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
