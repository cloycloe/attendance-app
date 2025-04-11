const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const router = express.Router();

// Login route
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    // Validation
    if (!username || !password) {
      return res.status(400).json({ 
        message: "Please provide both username and password" 
      });
    }

    // Find user (case-insensitive search)
    const user = await User.findOne({ 
      username: { $regex: new RegExp(`^${username}$`, 'i') }
    });

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Verify password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Create JWT token
    const token = jwt.sign(
      { 
        id: user._id,
        user_id: user.user_id,
        role: user.role,
        username: user.username 
      },
      process.env.JWT_SECRET || 'your_jwt_secret_key',
      { expiresIn: "1d" }
    );

    // Send response
    res.json({
      token,
      user: {
        _id: user._id,
        user_id: user.user_id,
        username: user.username,
        name: user.name,
        role: user.role,
        section: user.section
      }
    });

  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;