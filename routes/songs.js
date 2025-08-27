// routes/songs.js
const express = require("express");
const router = express.Router();
const Song = require("../models/Song");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Ensure uploads/songs folder exists
const uploadPath = path.join(__dirname, "..", "uploads", "songs");
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
}

// ==== Multer Config ====
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

// ===============================
// Upload multiple songs
// ===============================
router.post("/upload", upload.array("songs", 10), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: "No files uploaded" });
    }

    const songsData = req.files.map((file) => ({
      title: file.originalname.replace(/\.[^/.]+$/, ""), // remove extension
      artist: req.body.artist || "Unknown Artist",
      album: req.body.album || "Unknown Album",
      audioUrl: `/uploads/songs/${file.filename}`,
    }));

    const songs = await Song.insertMany(songsData);
    res.json(songs);
  } catch (err) {
    console.error("Upload error:", err);
    res.status(500).json({ error: err.message });
  }
});

// ===============================
// Get all songs
// ===============================
router.get("/", async (req, res) => {
  try {
    const songs = await Song.find();
    res.json(songs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ===============================
// Get song by ID
// ===============================
router.get("/:id", async (req, res) => {
  try {
    const song = await Song.findById(req.params.id);
    if (!song) return res.status(404).json({ error: "Song not found" });
    res.json(song);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ===============================
// Update song
// ===============================
router.put("/:id", async (req, res) => {
  try {
    const song = await Song.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!song) return res.status(404).json({ error: "Song not found" });
    res.json(song);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ===============================
// Delete song
// ===============================
router.delete("/:id", async (req, res) => {
  try {
    const song = await Song.findByIdAndDelete(req.params.id);
    if (!song) return res.status(404).json({ error: "Song not found" });
    res.json({ message: "Song deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
