const express = require("express");
const Section = require("../models/Section");
const { auth, authorize } = require("../middleware/auth");
const router = express.Router();

// Create section (Admin only)
router.post("/", auth, authorize("Administrator"), async (req, res) => {
  try {
    const { name, courseCodes } = req.body;
    
    const section = new Section({
      name,
      courseCodes
    });

    await section.save();
    res.status(201).json(section);
  } catch (error) {
    res.status(500).json({ message: "Error creating section", error: error.message });
  }
});

// Get all sections
router.get("/", auth, async (req, res) => {
  try {
    const sections = await Section.find().sort({ name: 1 });
    res.json(sections);
  } catch (error) {
    res.status(500).json({ message: "Error fetching sections", error: error.message });
  }
});

module.exports = router;