const express = require("express");
const router = express.Router();
const Album = require("../models/Album");

// Create Album
router.post("/", async (req, res) => {
  try {
    const album = new Album(req.body);
    await album.save();
    res.json(album);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all Albums (with songs populated)
router.get("/", async (req, res) => {
  try {
    const albums = await Album.find().populate("songs");
    res.json(albums);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get Album by ID
router.get("/:id", async (req, res) => {
  try {
    const album = await Album.findById(req.params.id).populate("songs");
    res.json(album);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update Album
router.put("/:id", async (req, res) => {
  try {
    const album = await Album.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(album);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete Album
router.delete("/:id", async (req, res) => {
  try {
    await Album.findByIdAndDelete(req.params.id);
    res.json({ message: "Album deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
