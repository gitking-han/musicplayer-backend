// index.js// index.js (top of file)
require("dotenv").config(); // load .env first (if you rely on .env)

// --- Sanitize Render's injected debug URL(s) so path-to-regexp won't choke ---
for (const k of Object.keys(process.env)) {
  const v = process.env[k];
  if (typeof v === "string" && v.includes("git.new/pathToRegexpError")) {
    // Option: delete or set to empty string
    delete process.env[k];
    // OR: process.env[k] = "";
  }
}

// also explicitly clear DEBUG_URL if present
if (process.env.DEBUG_URL) delete process.env.DEBUG_URL;
if (process.env.DEBUG) delete process.env.DEBUG;
if (process.env.NODE_DEBUG) delete process.env.NODE_DEBUG;
// -----------------------------------------------------------------------

const express = require("express");
const cors = require("cors");
const connectToMongo = require("./db");

connectToMongo();

const app = express();
const PORT = process.env.PORT || 5000;

// ---------- CORS Configuration ----------
const FRONTEND_URL = "https://musicplayer-frontend-ten.vercel.app";

app.use(cors({
  origin: FRONTEND_URL,
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

// Handle preflight requests
app.options("*", cors());

// ---------- Middleware ----------
app.use(express.json());

// Serve uploads folder
app.use("/uploads", express.static("uploads"));

// ---------- Routes ----------
// Use relative paths only — do NOT use full URLs or unsafe env vars
app.use("/api/auth", require("./routes/auth"));
app.use("/api/songs", require("./routes/songs"));
app.use("/api/albums", require("./routes/albums"));
app.use("/api/playlists", require("./routes/playlists"));
app.use("/api/user", require("./routes/user"));

// ---------- Start Server ----------
app.listen(PORT, () => {
  console.log(`🎵 Music App backend running on port ${PORT}`);
});
