const mongoose = require("mongoose");

const AlbumSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  artist: {
    type: String,
    required: true,
  },
  coverUrl: {
    type: String,
  },
  songs: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Song",
    },
  ],
}, { timestamps: true });

module.exports = mongoose.model("Album", AlbumSchema);
