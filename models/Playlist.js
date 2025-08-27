const mongoose = require("mongoose");

const PlaylistSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String },
    coverUrl: { type: String, default: "default-cover.jpg" },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    songs: [{ type: mongoose.Schema.Types.ObjectId, ref: "Song" }],
    isPublic: { type: Boolean, default: true }, // ✅ Public by default
  },
  { timestamps: true }
);

// Optional: prevent duplicate playlist names per user
PlaylistSchema.index({ name: 1, user: 1 }, { unique: true });

module.exports = mongoose.model("Playlist", PlaylistSchema);
