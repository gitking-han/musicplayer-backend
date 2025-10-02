const express = require("express");
const cors = require("cors");
const connectToMongo = require("./db");

connectToMongo();

const app = express();
const PORT = process.env.PORT || 5000;

// CORS
app.use(cors({
  origin: "https://musicplayer-frontend-ten.vercel.app",
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));
app.options("*", cors());

// Middleware
app.use(express.json());
app.use("/uploads", express.static("uploads"));

// Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/songs", require("./routes/songs"));
app.use("/api/albums", require("./routes/albums"));
app.use("/api/playlists", require("./routes/playlists"));
app.use("/api/user", require("./routes/user"));

// Start server
app.listen(PORT, () => {
  console.log(`🎵 Backend running on port ${PORT}`);
});
