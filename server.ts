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
import admin from "firebase-admin";

const require = createRequire(import.meta.url);
const pdf = require('pdf-parse');

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize Firebase Admin
const firebaseConfig = JSON.parse(fs.readFileSync(path.join(__dirname, "firebase-applet-config.json"), "utf8"));
admin.initializeApp({
  projectId: firebaseConfig.projectId,
});

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

const dbPath = "lexph.db";
let db: Database.Database;

try {
  db = new Database(dbPath);
  // Test the connection
  db.pragma('journal_mode = WAL');
} catch (err: any) {
  if (err.code === 'SQLITE_CORRUPT') {
    console.error("Database is corrupted. Recreating...");
    if (fs.existsSync(dbPath)) {
      fs.unlinkSync(dbPath);
    }
    db = new Database(dbPath);
  } else {
    throw err;
  }
}

// Initialize Database
db.exec(`
  CREATE TABLE IF NOT EXISTS notes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    content TEXT,
    category TEXT,
    tags TEXT,
    source_doc_id INTEGER,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS users (
    uid TEXT PRIMARY KEY,
    email TEXT NOT NULL,
    display_name TEXT,
    role TEXT DEFAULT 'user', -- 'user', 'admin'
    last_login DATETIME DEFAULT CURRENT_TIMESTAMP,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS documents (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    filename TEXT NOT NULL,
    title TEXT,
    type TEXT, -- 'case', 'statute', 'memo'
    citation TEXT,
    author TEXT,
    date_published TEXT,
    keywords TEXT, -- comma-separated keywords
    summary TEXT,
    tags TEXT, -- comma-separated tags
    size INTEGER,
    status TEXT DEFAULT 'completed', -- 'processing', 'completed', 'failed'
    citation_check TEXT, -- JSON string for citation analysis
    legal_summary TEXT, -- JSON string for structured legal summary
    citation_analysis TEXT, -- Extracted detailed citation analysis
    uploaded_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    version INTEGER DEFAULT 1,
    uid TEXT, -- Owner UID
    is_public INTEGER DEFAULT 0 -- 0 for private, 1 for public
  );

  CREATE TABLE IF NOT EXISTS document_versions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    document_id INTEGER NOT NULL,
    filename TEXT NOT NULL,
    version INTEGER NOT NULL,
    size INTEGER,
    summary TEXT,
    citation_check TEXT,
    legal_summary TEXT,
    citation_analysis TEXT,
    uploaded_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (document_id) REFERENCES documents(id) ON DELETE CASCADE
  );

  CREATE INDEX IF NOT EXISTS idx_document_versions_document_id ON document_versions(document_id);
  CREATE INDEX IF NOT EXISTS idx_documents_uploaded_at ON documents(uploaded_at DESC);
  CREATE INDEX IF NOT EXISTS idx_documents_author ON documents(author);
  CREATE INDEX IF NOT EXISTS idx_documents_date_published ON documents(date_published);
  CREATE INDEX IF NOT EXISTS idx_notes_source_doc_id ON notes(source_doc_id);
  CREATE INDEX IF NOT EXISTS idx_notes_created_at ON notes(created_at DESC);

  -- Add version column if it doesn't exist (for existing databases)
  PRAGMA table_info(documents);
`);

// Re-index files if database is empty
async function reindexFiles() {
  const count = db.prepare("SELECT COUNT(*) as count FROM documents").get() as { count: number };
  if (count.count === 0) {
    console.log("Database is empty. Re-indexing files from uploads directory...");
    if (fs.existsSync(uploadDir)) {
      const files = fs.readdirSync(uploadDir);
      for (const filename of files) {
        try {
          const filePath = path.join(uploadDir, filename);
          const stats = fs.statSync(filePath);
          if (stats.isFile()) {
            let summary = "";
            const ext = path.extname(filename).toLowerCase();
            if (['.txt', '.md', '.csv', '.json', '.html'].includes(ext)) {
              const content = fs.readFileSync(filePath, 'utf8');
              summary = content.substring(0, 200) + (content.length > 200 ? '...' : '');
            } else if (ext === '.pdf') {
              try {
                const dataBuffer = fs.readFileSync(filePath);
                const data = await pdf(dataBuffer);
                summary = data.text.substring(0, 200) + (data.text.length > 200 ? '...' : '');
              } catch (err) {
                summary = `Recovered document: ${filename}`;
              }
            } else if (ext === '.docx') {
              try {
                const dataBuffer = fs.readFileSync(filePath);
                const result = await mammoth.extractRawText({ buffer: dataBuffer });
                summary = result.value.substring(0, 200) + (result.value.length > 200 ? '...' : '');
              } catch (err) {
                summary = `Recovered document: ${filename}`;
              }
            } else {
              summary = `Recovered document: ${filename}`;
            }

            db.prepare("INSERT INTO documents (filename, title, type, summary, size, status) VALUES (?, ?, ?, ?, ?, ?)").run(
              filename,
              filename,
              'case',
              summary,
              stats.size,
              'completed'
            );
          }
        } catch (err) {
          console.error(`Failed to re-index file ${filename}:`, err);
        }
      }
    }
  }
}

reindexFiles();

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
if (!columns.includes('legal_summary')) {
  db.exec("ALTER TABLE documents ADD COLUMN legal_summary TEXT;");
}
if (!columns.includes('citation_analysis')) {
  db.exec("ALTER TABLE documents ADD COLUMN citation_analysis TEXT;");
}
if (!columns.includes('version')) {
  db.exec("ALTER TABLE documents ADD COLUMN version INTEGER DEFAULT 1;");
}
if (!columns.includes('uid')) {
  db.exec("ALTER TABLE documents ADD COLUMN uid TEXT;");
}
if (!columns.includes('is_public')) {
  db.exec("ALTER TABLE documents ADD COLUMN is_public INTEGER DEFAULT 0;");
}

// Check document_versions table columns
const versionTableInfo = db.prepare("PRAGMA table_info(document_versions)").all() as any[];
const versionColumns = versionTableInfo.map(col => col.name);
if (!versionColumns.includes('citation_check')) {
  db.exec("ALTER TABLE document_versions ADD COLUMN citation_check TEXT;");
}
if (!versionColumns.includes('legal_summary')) {
  db.exec("ALTER TABLE document_versions ADD COLUMN legal_summary TEXT;");
}
if (!versionColumns.includes('citation_analysis')) {
  db.exec("ALTER TABLE document_versions ADD COLUMN citation_analysis TEXT;");
}
if (!columns.includes('author')) {
  db.exec("ALTER TABLE documents ADD COLUMN author TEXT;");
}
if (!columns.includes('date_published')) {
  db.exec("ALTER TABLE documents ADD COLUMN date_published TEXT;");
}
if (!columns.includes('keywords')) {
  db.exec("ALTER TABLE documents ADD COLUMN keywords TEXT;");
}

// Check notes table columns
const noteTableInfo = db.prepare("PRAGMA table_info(notes)").all() as any[];
const noteColumns = noteTableInfo.map(col => col.name);
if (!noteColumns.includes('tags')) {
  db.exec("ALTER TABLE notes ADD COLUMN tags TEXT;");
}
if (!noteColumns.includes('source_doc_id')) {
  db.exec("ALTER TABLE notes ADD COLUMN source_doc_id INTEGER;");
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Authentication Middleware
  const authenticate = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Unauthorized: Missing or invalid token" });
    }

    const idToken = authHeader.split("Bearer ")[1];
    try {
      const decodedToken = await admin.auth().verifyIdToken(idToken);
      
      // Sync user to local DB
      let user = db.prepare("SELECT * FROM users WHERE uid = ?").get(decodedToken.uid) as any;
      if (!user) {
        db.prepare("INSERT INTO users (uid, email, display_name, role) VALUES (?, ?, ?, ?)").run(
          decodedToken.uid,
          decodedToken.email || "",
          decodedToken.name || "",
          decodedToken.email === "constantinomichelleannel@gmail.com" ? "admin" : "user" // Bootstrap first admin
        );
        user = db.prepare("SELECT * FROM users WHERE uid = ?").get(decodedToken.uid);
      } else {
        db.prepare("UPDATE users SET last_login = CURRENT_TIMESTAMP, display_name = ?, email = ? WHERE uid = ?").run(
          decodedToken.name || user.display_name,
          decodedToken.email || user.email,
          decodedToken.uid
        );
      }

      (req as any).user = { ...decodedToken, role: user.role };
      next();
    } catch (error) {
      console.error("Authentication error:", error);
      res.status(401).json({ error: "Unauthorized: Invalid token" });
    }
  };

  const isAdmin = (req: express.Request, res: express.Response, next: express.NextFunction) => {
    if ((req as any).user && (req as any).user.role === 'admin') {
      next();
    } else {
      res.status(403).json({ error: "Forbidden: Admin access required" });
    }
  };

  // Health check endpoint
  app.get("/api/health", (req, res) => {
    try {
      const result = db.prepare("SELECT 1 as connected").get() as { connected: number };
      if (result && result.connected === 1) {
        res.json({ status: "ok", database: "connected" });
      } else {
        res.status(500).json({ status: "error", database: "disconnected" });
      }
    } catch (err) {
      console.error("Health check failed:", err);
      res.status(500).json({ status: "error", database: "error", message: err instanceof Error ? err.message : String(err) });
    }
  });

  // API Routes
  app.get("/api/notes", authenticate, (req, res) => {
    const notes = db.prepare("SELECT * FROM notes ORDER BY created_at DESC").all();
    res.json(notes);
  });

  app.post("/api/notes", authenticate, (req, res) => {
    const { title, content, category, tags, source_doc_id } = req.body;
    const info = db.prepare("INSERT INTO notes (title, content, category, tags, source_doc_id) VALUES (?, ?, ?, ?, ?)").run(
      title, 
      content, 
      category, 
      tags || null, 
      source_doc_id || null
    );
    res.json({ id: info.lastInsertRowid });
  });

  app.patch("/api/notes/:id", authenticate, (req, res) => {
    const { id } = req.params;
    const { title, content, category, tags, source_doc_id } = req.body;
    
    if (title !== undefined) db.prepare("UPDATE notes SET title = ? WHERE id = ?").run(title, id);
    if (content !== undefined) db.prepare("UPDATE notes SET content = ? WHERE id = ?").run(content, id);
    if (category !== undefined) db.prepare("UPDATE notes SET category = ? WHERE id = ?").run(category, id);
    if (tags !== undefined) db.prepare("UPDATE notes SET tags = ? WHERE id = ?").run(tags, id);
    if (source_doc_id !== undefined) db.prepare("UPDATE notes SET source_doc_id = ? WHERE id = ?").run(source_doc_id, id);
    
    res.json({ success: true });
  });

  app.delete("/api/notes/:id", authenticate, (req, res) => {
    db.prepare("DELETE FROM notes WHERE id = ?").run(req.params.id);
    res.json({ success: true });
  });

  app.get("/api/documents", authenticate, (req, res) => {
    try {
      const { view } = req.query;
      const user = (req as any).user;
      
      let query = "SELECT * FROM documents";
      let params: any[] = [];

      if (view === 'public') {
        query += " WHERE is_public = 1";
      } else if (view === 'mine') {
        query += " WHERE uid = ?";
        params.push(user.uid);
      } else {
        // Default: show both mine and public
        query += " WHERE uid = ? OR is_public = 1";
        params.push(user.uid);
      }

      query += " ORDER BY uploaded_at DESC";
      
      const docs = db.prepare(query).all(...params) as any[];
      const allVersions = db.prepare("SELECT * FROM document_versions ORDER BY version DESC").all() as any[];
      
      const versionsByDocId: Record<number, any[]> = {};
      allVersions.forEach(v => {
        const formattedVersion = {
          ...v,
          citation_check: v.citation_check ? JSON.parse(v.citation_check) : null,
          legal_summary: v.legal_summary ? JSON.parse(v.legal_summary) : null
        };
        if (!versionsByDocId[v.document_id]) {
          versionsByDocId[v.document_id] = [];
        }
        versionsByDocId[v.document_id].push(formattedVersion);
      });

      const formattedDocs = docs.map(doc => {
        return {
          ...doc,
          tags: doc.tags ? doc.tags.split(',').map((t: string) => t.trim()) : [],
          keywords: doc.keywords ? doc.keywords.split(',').map((k: string) => k.trim()) : [],
          citation_check: doc.citation_check ? JSON.parse(doc.citation_check) : null,
          legal_summary: doc.legal_summary ? JSON.parse(doc.legal_summary) : null,
          versions: versionsByDocId[doc.id] || []
        };
      });
      res.json(formattedDocs);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to fetch documents" });
    }
  });

  app.post("/api/documents", authenticate, upload.single("file"), async (req, res) => {
    const { title, type, tags, citation, summary: providedSummary, citation_check, author, date_published, keywords } = req.body;
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

      const info = db.prepare("INSERT INTO documents (filename, title, type, citation, author, date_published, keywords, summary, tags, size, status, citation_check, uid, is_public) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)").run(
        file.filename,
        title || file.originalname,
        type || 'case',
        citation || '',
        author || '',
        date_published || '',
        keywords || '',
        summary,
        tags || '',
        file.size,
        'completed',
        citation_check || null,
        (req as any).user.uid,
        0 // Default to private
      );
      res.json({ id: info.lastInsertRowid, filename: file.filename, summary });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to save document metadata" });
    }
  });

  app.post("/api/documents/save-summary", authenticate, async (req, res) => {
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

      const info = db.prepare("INSERT INTO documents (filename, title, type, citation, summary, tags, size, status, uid, is_public) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)").run(
        filename,
        title,
        'case',
        citation || '',
        summary.substring(0, 500) + (summary.length > 500 ? '...' : ''),
        tags || 'ai-generated,summary',
        stats.size,
        'completed',
        (req as any).user.uid,
        0 // Default to private
      );

      res.json({ id: info.lastInsertRowid, filename });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to save summary" });
    }
  });

  app.post("/api/documents/:id/version", authenticate, upload.single("file"), async (req, res) => {
    const { id } = req.params;
    const file = req.file;
    const { summary: bodySummary, citation_check } = req.body;

    if (!file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const doc = db.prepare("SELECT * FROM documents WHERE id = ?").get(id) as any;
    if (!doc) {
      return res.status(404).json({ error: "Document not found" });
    }

    try {
      // 1. Save current state to versions
      db.prepare("INSERT INTO document_versions (document_id, filename, version, size, summary, citation_check, legal_summary, citation_analysis) VALUES (?, ?, ?, ?, ?, ?, ?, ?)").run(
        doc.id,
        doc.filename,
        doc.version,
        doc.size,
        doc.summary,
        doc.citation_check,
        doc.legal_summary,
        doc.citation_analysis
      );

      // 2. Extract summary for new file if not provided
      let summary = bodySummary || "";
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
            summary = `New version uploaded: ${file.originalname}`;
          }
        } else if (ext === '.docx') {
          try {
            const dataBuffer = fs.readFileSync(filePath);
            const result = await mammoth.extractRawText({ buffer: dataBuffer });
            summary = result.value.substring(0, 200) + (result.value.length > 200 ? '...' : '');
          } catch (err) {
            summary = `New version uploaded: ${file.originalname}`;
          }
        } else {
          summary = `New version uploaded: ${file.originalname}`;
        }
      }

      // 3. Update document with new info
      db.prepare("UPDATE documents SET filename = ?, size = ?, summary = ?, version = version + 1, citation_check = ?, legal_summary = NULL, citation_analysis = NULL, uploaded_at = CURRENT_TIMESTAMP WHERE id = ?").run(
        file.filename,
        file.size,
        summary,
        citation_check || null,
        id
      );

      res.json({ success: true, version: doc.version + 1 });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to upload new version" });
    }
  });

  app.post("/api/documents/:id/revert/:versionId", authenticate, async (req, res) => {
    const { id, versionId } = req.params;

    const currentDoc = db.prepare("SELECT * FROM documents WHERE id = ?").get(id) as any;
    const targetVersion = db.prepare("SELECT * FROM document_versions WHERE id = ? AND document_id = ?").get(versionId, id) as any;

    if (!currentDoc || !targetVersion) {
      return res.status(404).json({ error: "Document or version not found" });
    }

    try {
      // 1. Save current state to versions
      db.prepare("INSERT INTO document_versions (document_id, filename, version, size, summary, citation_check, legal_summary, citation_analysis) VALUES (?, ?, ?, ?, ?, ?, ?, ?)").run(
        currentDoc.id,
        currentDoc.filename,
        currentDoc.version,
        currentDoc.size,
        currentDoc.summary,
        currentDoc.citation_check,
        currentDoc.legal_summary,
        currentDoc.citation_analysis
      );

      // 2. Update document with version info
      db.prepare("UPDATE documents SET filename = ?, size = ?, summary = ?, version = ?, citation_check = ?, legal_summary = ?, citation_analysis = ?, uploaded_at = CURRENT_TIMESTAMP WHERE id = ?").run(
        targetVersion.filename,
        targetVersion.size,
        targetVersion.summary,
        targetVersion.version,
        targetVersion.citation_check,
        targetVersion.legal_summary,
        targetVersion.citation_analysis,
        id
      );

      // 3. Delete the version we just reverted to from the history (since it's now current)
      db.prepare("DELETE FROM document_versions WHERE id = ?").run(versionId);

      res.json({ success: true });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to revert version" });
    }
  });

  app.patch("/api/documents/:id", authenticate, (req, res) => {
    const { id } = req.params;
    const { citation_check, legal_summary, citation_analysis, title, citation, tags, author, date_published, keywords, is_public } = req.body;

    try {
      if (citation_check !== undefined) {
        db.prepare("UPDATE documents SET citation_check = ? WHERE id = ?").run(
          citation_check ? JSON.stringify(citation_check) : null,
          id
        );
      }

      if (legal_summary !== undefined) {
        db.prepare("UPDATE documents SET legal_summary = ? WHERE id = ?").run(
          legal_summary ? JSON.stringify(legal_summary) : null,
          id
        );
      }

      if (citation_analysis !== undefined) {
        db.prepare("UPDATE documents SET citation_analysis = ? WHERE id = ?").run(citation_analysis, id);
      }
      
      if (title !== undefined) {
        db.prepare("UPDATE documents SET title = ? WHERE id = ?").run(title, id);
      }
      
      if (citation !== undefined) {
        db.prepare("UPDATE documents SET citation = ? WHERE id = ?").run(citation, id);
      }
      
      if (tags !== undefined) {
        db.prepare("UPDATE documents SET tags = ? WHERE id = ?").run(tags, id);
      }

      if (author !== undefined) {
        db.prepare("UPDATE documents SET author = ? WHERE id = ?").run(author, id);
      }

      if (date_published !== undefined) {
        db.prepare("UPDATE documents SET date_published = ? WHERE id = ?").run(date_published, id);
      }

      if (keywords !== undefined) {
        db.prepare("UPDATE documents SET keywords = ? WHERE id = ?").run(keywords, id);
      }

      if (is_public !== undefined) {
        db.prepare("UPDATE documents SET is_public = ? WHERE id = ?").run(is_public ? 1 : 0, id);
      }

      res.json({ success: true });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to update document metadata" });
    }
  });

  app.get("/api/documents/download/:filename", authenticate, (req, res) => {
    const filePath = path.join(uploadDir, req.params.filename);
    if (fs.existsSync(filePath)) {
      res.download(filePath);
    } else {
      res.status(404).json({ error: "File not found" });
    }
  });

  app.get("/api/documents/preview/:filename", authenticate, async (req, res) => {
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

  app.delete("/api/documents/:id", authenticate, (req, res) => {
    const doc = db.prepare("SELECT filename FROM documents WHERE id = ?").get(req.params.id) as any;
    if (doc) {
      // Delete main file
      const filePath = path.join(uploadDir, doc.filename);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }

      // Delete version files
      const versions = db.prepare("SELECT filename FROM document_versions WHERE document_id = ?").all(req.params.id) as any[];
      for (const version of versions) {
        const vPath = path.join(uploadDir, version.filename);
        if (fs.existsSync(vPath)) {
          fs.unlinkSync(vPath);
        }
      }

      db.prepare("DELETE FROM documents WHERE id = ?").run(req.params.id);
    }
    res.json({ success: true });
  });

  app.post("/api/documents/batch-delete", authenticate, (req, res) => {
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

  app.post("/api/documents/batch-download", authenticate, async (req, res) => {
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

  // Admin Routes
  app.get("/api/admin/users", authenticate, isAdmin, (req, res) => {
    const users = db.prepare("SELECT * FROM users ORDER BY created_at DESC").all();
    res.json(users);
  });

  app.patch("/api/admin/users/:uid/role", authenticate, isAdmin, (req, res) => {
    const { uid } = req.params;
    const { role } = req.body;
    if (!['user', 'admin'].includes(role)) {
      return res.status(400).json({ error: "Invalid role" });
    }
    db.prepare("UPDATE users SET role = ? WHERE uid = ?").run(role, uid);
    res.json({ success: true });
  });

  app.get("/api/admin/stats", authenticate, isAdmin, (req, res) => {
    const userCount = db.prepare("SELECT COUNT(*) as count FROM users").get() as any;
    const docCount = db.prepare("SELECT COUNT(*) as count FROM documents").get() as any;
    const noteCount = db.prepare("SELECT COUNT(*) as count FROM notes").get() as any;
    const recentUsers = db.prepare("SELECT * FROM users ORDER BY last_login DESC LIMIT 5").all();
    
    res.json({
      users: userCount.count,
      documents: docCount.count,
      notes: noteCount.count,
      recentUsers
    });
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
