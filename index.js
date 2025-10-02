// index.js
require("dotenv").config(); // Load .env at the very top

const express = require("express");
const cors = require("cors");
const connectToMongo = require("./db");

connectToMongo();

const app = express();
const PORT = process.env.PORT || 5000;

// ---------- Safe API Base ----------
const apiBase = process.env.BASE_URL?.startsWith("/") ? process.env.BASE_URL : "";

// ---------- CORS ----------
const FRONTEND_URL = "https://musicplayer-frontend-ten.vercel.app";

app.use(cors({
  origin: FRONTEND_URL,
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

// Handle preflight requests globally
app.options("*", cors());

// ---------- Middleware ----------
app.use(express.json());

// Serve uploaded files statically
app.use("/uploads", express.static("uploads"));

// ---------- Routes ----------
// Use apiBase safely for all route mounts
app.use(apiBase + "/api/auth", require("./routes/auth"));
app.use(apiBase + "/api/songs", require("./routes/songs"));
app.use(apiBase + "/api/albums", require("./routes/albums"));
app.use(apiBase + "/api/playlists", require("./routes/playlists"));
app.use(apiBase + "/api/user", require("./routes/user"));

// ---------- Start Server ----------
app.listen(PORT, () => {
  console.log(`🎵 Music App backend running on port ${PORT}`);
});
