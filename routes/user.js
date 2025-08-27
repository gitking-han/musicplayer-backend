// routes/user.js
const express = require("express");
const router = express.Router();
const User = require("../models/User");
const fetchuser = require("../middleware/fetchuser"); 

// Update user profile
router.put("/update", fetchuser, async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Build update object
    let updateData = {};
    if (username) updateData.username = username;
    if (email) updateData.email = email;
    if (password) updateData.password = password; // hash before saving in real app

    // Make sure req.user exists
    if (!req.user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    // Update user
    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { $set: updateData },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(updatedUser);
  } catch (error) {
    console.error("❌ Update user error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
