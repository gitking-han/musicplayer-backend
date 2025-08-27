const express = require("express");
const router = express.Router();
const Playlist = require("../models/Playlist");
const fetchuser = require("../middleware/fetchuser");

// ✅ Create Playlist
router.post("/", fetchuser, async (req, res) => {
  try {
    const { name, description, coverUrl, songs, isPublic } = req.body;

    const playlist = new Playlist({
      name,
      description,
      coverUrl,
      songs: songs || [],
      isPublic: isPublic !== undefined ? isPublic : true, // 👈 Default true
      user: req.user.id,
    });

    const saved = await playlist.save();
    res.json(saved);
  } catch (err) {
    console.error("Create Playlist Error:", err);
    res.status(500).json({ error: err.message });
  }
});

// ✅ Get all public playlists
router.get("/", async (req, res) => {
  try {
    const playlists = await Playlist.find({ isPublic: true })
      .populate("songs")
      .populate("user", "username email");
    res.json(playlists);
  } catch (err) {
    console.error("Get All Playlists Error:", err);
    res.status(500).json({ error: err.message });
  }
});

// ✅ Get logged-in user's playlists (both public & private)
router.get("/my", fetchuser, async (req, res) => {
  try {
    const playlists = await Playlist.find({ user: req.user.id })
      .populate("songs")
      .populate("user", "username email");
    res.json(playlists);
  } catch (err) {
    console.error("Get My Playlists Error:", err);
    res.status(500).json({ error: err.message });
  }
});

// ✅ Get Playlist by ID (only if public OR owned by user)
router.get("/:id", fetchuser, async (req, res) => {
  try {
    const playlist = await Playlist.findById(req.params.id)
      .populate("songs")
      .populate("user", "username email");

    if (!playlist) {
      return res.status(404).json({ message: "Playlist not found" });
    }

    if (!playlist.isPublic && playlist.user._id.toString() !== req.user.id) {
      return res.status(403).json({ message: "This playlist is private" });
    }

    res.json(playlist);
  } catch (err) {
    console.error("Get Playlist by ID Error:", err);
    res.status(500).json({ error: err.message });
  }
});

// ✅ Update Playlist (owner only)
router.put("/:id", fetchuser, async (req, res) => {
  try {
    const playlist = await Playlist.findById(req.params.id);

    if (!playlist) {
      return res.status(404).json({ message: "Playlist not found" });
    }

    if (playlist.user.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    const updated = await Playlist.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          name: req.body.name,
          description: req.body.description,
          coverUrl: req.body.coverUrl,
          songs: req.body.songs,
          isPublic: req.body.isPublic, // 👈 allow toggle
        },
      },
      { new: true }
    )
      .populate("songs")
      .populate("user", "username email");

    res.json(updated);
  } catch (err) {
    console.error("Update Playlist Error:", err);
    res.status(500).json({ error: err.message });
  }
});

// ✅ Delete Playlist (owner only)
router.delete("/:id", fetchuser, async (req, res) => {
  try {
    const playlist = await Playlist.findById(req.params.id);

    if (!playlist) {
      return res.status(404).json({ message: "Playlist not found" });
    }

    if (playlist.user.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    await Playlist.findByIdAndDelete(req.params.id);
    res.json({ message: "Playlist deleted" });
  } catch (err) {
    console.error("Delete Playlist Error:", err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
