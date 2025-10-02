const express = require("express");
const cors = require("cors");
const connectToMongo = require("./db");

connectToMongo();

const app = express();
const PORT = process.env.PORT || 5000;

// CORS configuration
const corsOptions = {
  origin: "https://musicplayer-frontend-ten.vercel.app", // your frontend URL
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true, // needed if you send cookies or auth headers
};

// Apply CORS middleware
app.use(cors(corsOptions));

// Handle preflight requests for all routes
app.options("*", cors(corsOptions));

// Middleware
app.use(express.json());

// Serve uploaded files statically
app.use("/uploads", express.static("uploads"));

// Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/songs", require("./routes/songs"));
app.use("/api/albums", require("./routes/albums"));
app.use("/api/playlists", require("./routes/playlists"));
app.use("/api/user", require("./routes/user"));

// Start server
app.listen(PORT, () => {
  console.log(`🎵 Music App backend running at http://localhost:${PORT}`);
});
