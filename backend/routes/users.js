const express = require("express");
const User = require("../models/User");
const { auth, authorize } = require("../middleware/auth");
const router = express.Router();

// Add new user (admin only)
router.post("/add", auth, authorize("Administrator"), async (req, res) => {
  try {
    const { user_id, username, password, name, role } = req.body;

    // Validate required fields
    if (!user_id || !username || !password || !name || !role) {
      return res.status(400).json({ 
        message: "All fields are required (user_id, username, password, name, role)" 
      });
    }

    // Check if username or user_id already exists
    const existingUser = await User.findOne({ 
      $or: [{ username }, { user_id }] 
    });
    
    if (existingUser) {
      return res.status(400).json({ 
        message: "Username or User ID already exists" 
      });
    }

    // Create new user
    const newUser = new User({
      user_id,
      username,
      password, // Will be automatically hashed by the schema
      name,
      role
    });

    await newUser.save();

    // Return user without password
    const userResponse = {
      _id: newUser._id,
      user_id: newUser.user_id,
      username: newUser.username,
      name: newUser.name,
      role: newUser.role
    };

    res.status(201).json({ 
      message: "User created successfully", 
      user: userResponse 
    });

  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ 
      message: "Error creating user", 
      error: error.message 
    });
  }
});

// Get all users (with optional role filter)
router.get("/", auth, async (req, res) => {
  try {
    const { role } = req.query;
    const filter = role ? { role } : {};
    
    const users = await User.find(filter)
      .select('-password') // Exclude password
      .sort({ username: 1 });
    
    res.json(users);
  } catch (error) {
    res.status(500).json({ 
      message: "Error fetching users", 
      error: error.message 
    });
  }
});

// Get user by ID
router.get("/:id", auth, async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select('-password');
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    res.json(user);
  } catch (error) {
    res.status(500).json({ 
      message: "Error fetching user", 
      error: error.message 
    });
  }
});

// Update user
router.put("/:id", auth, async (req, res) => {
  try {
    const { username, name, role } = req.body;
    const userId = req.params.id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update fields
    if (username) user.username = username;
    if (name) user.name = name;
    if (role) user.role = role;

    await user.save();

    const updatedUser = await User.findById(userId)
      .select('-password');

    res.json({ 
      message: "User updated successfully", 
      user: updatedUser 
    });
  } catch (error) {
    res.status(500).json({ 
      message: "Error updating user", 
      error: error.message 
    });
  }
});

// Delete user
router.delete("/:id", auth, authorize("Administrator"), async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ 
      message: "Error deleting user", 
      error: error.message 
    });
  }
});

module.exports = router;