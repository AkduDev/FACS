import express from "express";
import path from "path";
import fs from "fs/promises";
import { createServer as createViteServer } from "vite";

// Import pre-seeded initial data
import {
  INITIAL_GALLERY,
  INITIAL_NEWS,
  INITIAL_EVENTS,
  INITIAL_INSTRUCTORS,
  INITIAL_GRADUATES
} from "./src/initialData";

const dbPath = path.join(process.cwd(), "database.json");

interface DbSchema {
  gallery: any[];
  news: any[];
  events: any[];
  instructors: any[];
  graduates: any[];
}

// Read database or initialize it
async function readDb(): Promise<DbSchema> {
  try {
    const data = await fs.readFile(dbPath, "utf-8");
    return JSON.parse(data);
  } catch (err) {
    // If file doesn't exist, seed it
    const initialDb: DbSchema = {
      gallery: INITIAL_GALLERY,
      news: INITIAL_NEWS,
      events: INITIAL_EVENTS,
      instructors: INITIAL_INSTRUCTORS,
      graduates: INITIAL_GRADUATES
    };
    await writeDb(initialDb);
    return initialDb;
  }
}

async function writeDb(data: DbSchema): Promise<void> {
  await fs.writeFile(dbPath, JSON.stringify(data, null, 2), "utf-8");
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Initialize DB on start
  await readDb();

  // --- API Routes ---

  // Gallery Endpoints
  app.get("/api/gallery", async (req, res) => {
    try {
      const db = await readDb();
      res.json(db.gallery);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post("/api/gallery", async (req, res) => {
    try {
      const { id, url, title, description, category, date } = req.body;
      const db = await readDb();
      const newItem = { id, url, title, description, category, date };
      db.gallery.push(newItem);
      await writeDb(db);
      res.status(201).json(newItem);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.put("/api/gallery/:id", async (req, res) => {
    try {
      const { url, title, description, category, date } = req.body;
      const { id } = req.params;
      const db = await readDb();
      const index = db.gallery.findIndex((item) => item.id === id);
      if (index !== -1) {
        db.gallery[index] = { id, url, title, description, category, date };
        await writeDb(db);
        res.json(db.gallery[index]);
      } else {
        res.status(404).json({ error: "Item not found" });
      }
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.delete("/api/gallery/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const db = await readDb();
      db.gallery = db.gallery.filter((item) => item.id !== id);
      await writeDb(db);
      res.json({ success: true, id });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // News Endpoints
  app.get("/api/news", async (req, res) => {
    try {
      const db = await readDb();
      res.json(db.news);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post("/api/news", async (req, res) => {
    try {
      const { id, title, content, date, image, author, category } = req.body;
      const db = await readDb();
      const newItem = { id, title, content, date, image: image || "", author, category };
      db.news.push(newItem);
      await writeDb(db);
      res.status(201).json(newItem);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.put("/api/news/:id", async (req, res) => {
    try {
      const { title, content, date, image, author, category } = req.body;
      const { id } = req.params;
      const db = await readDb();
      const index = db.news.findIndex((item) => item.id === id);
      if (index !== -1) {
        db.news[index] = { id, title, content, date, image: image || "", author, category };
        await writeDb(db);
        res.json(db.news[index]);
      } else {
        res.status(404).json({ error: "Item not found" });
      }
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.delete("/api/news/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const db = await readDb();
      db.news = db.news.filter((item) => item.id !== id);
      await writeDb(db);
      res.json({ success: true, id });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Events Endpoints
  app.get("/api/events", async (req, res) => {
    try {
      const db = await readDb();
      res.json(db.events);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post("/api/events", async (req, res) => {
    try {
      const { id, title, date, location, description, category, image } = req.body;
      const db = await readDb();
      const newItem = { id, title, date, location, description, category, image: image || "" };
      db.events.push(newItem);
      await writeDb(db);
      res.status(201).json(newItem);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.put("/api/events/:id", async (req, res) => {
    try {
      const { title, date, location, description, category, image } = req.body;
      const { id } = req.params;
      const db = await readDb();
      const index = db.events.findIndex((item) => item.id === id);
      if (index !== -1) {
        db.events[index] = { id, title, date, location, description, category, image: image || "" };
        await writeDb(db);
        res.json(db.events[index]);
      } else {
        res.status(404).json({ error: "Item not found" });
      }
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.delete("/api/events/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const db = await readDb();
      db.events = db.events.filter((item) => item.id !== id);
      await writeDb(db);
      res.json({ success: true, id });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Instructors Endpoints
  app.get("/api/instructors", async (req, res) => {
    try {
      const db = await readDb();
      res.json(db.instructors);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post("/api/instructors", async (req, res) => {
    try {
      const { id, name, bio, level, certificationCode, photo, experienceYears } = req.body;
      const db = await readDb();
      const newItem = { id, name, bio, level, certificationCode, photo, experienceYears: Number(experienceYears) };
      db.instructors.push(newItem);
      await writeDb(db);
      res.status(201).json(newItem);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.put("/api/instructors/:id", async (req, res) => {
    try {
      const { name, bio, level, certificationCode, photo, experienceYears } = req.body;
      const { id } = req.params;
      const db = await readDb();
      const index = db.instructors.findIndex((item) => item.id === id);
      if (index !== -1) {
        db.instructors[index] = { id, name, bio, level, certificationCode, photo, experienceYears: Number(experienceYears) };
        await writeDb(db);
        res.json(db.instructors[index]);
      } else {
        res.status(404).json({ error: "Item not found" });
      }
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.delete("/api/instructors/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const db = await readDb();
      db.instructors = db.instructors.filter((item) => item.id !== id);
      await writeDb(db);
      res.json({ success: true, id });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Graduates Endpoints
  app.get("/api/graduates", async (req, res) => {
    try {
      const db = await readDb();
      res.json(db.graduates);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post("/api/graduates", async (req, res) => {
    try {
      const { id, name, certificationCode, courseName, graduationDate, instructorName, level } = req.body;
      const db = await readDb();
      const newItem = { id, name, certificationCode, courseName, graduationDate, instructorName, level };
      db.graduates.push(newItem);
      await writeDb(db);
      res.status(201).json(newItem);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.put("/api/graduates/:id", async (req, res) => {
    try {
      const { name, certificationCode, courseName, graduationDate, instructorName, level } = req.body;
      const { id } = req.params;
      const db = await readDb();
      const index = db.graduates.findIndex((item) => item.id === id);
      if (index !== -1) {
        db.graduates[index] = { id, name, certificationCode, courseName, graduationDate, instructorName, level };
        await writeDb(db);
        res.json(db.graduates[index]);
      } else {
        res.status(404).json({ error: "Item not found" });
      }
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.delete("/api/graduates/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const db = await readDb();
      db.graduates = db.graduates.filter((item) => item.id !== id);
      await writeDb(db);
      res.json({ success: true, id });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Serve static files / Vite middleware
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error("Failed to start server:", err);
});
