const express = require("express");
const router = express.Router();

const Song = require("../models/Song");
const Album = require("../models/Album");
const Playlist = require("../models/Playlist");

// Get All Songs
router.get("/songs", async (req, res) => {
  try {
    const songs = await Song.find();
    res.json(songs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get All Albums with Songs
router.get("/albums", async (req, res) => {
  try {
    const albums = await Album.find().populate("songs");
    res.json(albums);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get All Playlists with Songs
router.get("/playlists", async (req, res) => {
  try {
    const playlists = await Playlist.find()
      .populate("songs")
      .populate("user", "username email");
    res.json(playlists);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
