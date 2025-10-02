const connectToMongo = require("./db");
const express = require("express");
const cors = require("cors");

connectToMongo();
const app = express();
const PORT = process.env.PORT || 5000;


// Middleware
app.use(express.json());
app.use(cors());

// Serve uploaded files statically
app.use("/uploads", express.static("uploads"));

// Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/songs", require("./routes/songs"));
app.use("/api/albums", require("./routes/albums"));
app.use("/api/playlists", require("./routes/playlists"));
app.use("/api/user", require("./routes/user"));


app.listen(PORT, () => {
  console.log(`🎵 Music App backend running at http://localhost:${PORT}`);
});
