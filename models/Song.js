// models/Song.js
const mongoose = require("mongoose");

const SongSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    artist: {
      type: String,
      required: true,
    },
    album: {
      type: String,
    },
    coverUrl: {
      type: String, // default cover image
      default: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?fit=crop&w=500&q=80", 
    },
    audioUrl: {
      type: String, // uploaded audio file URL
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Song", SongSchema);
