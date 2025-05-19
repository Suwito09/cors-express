const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const dotenv = require("dotenv");
const protect = require("../middleware/middleware"); // Mengimpor middleware

dotenv.config();

const router = express.Router();

// Endpoint Register (Tidak memerlukan autentikasi)
router.post("/register", async (req, res) => {
  const { username, password } = req.body;
  try {
    const userExists = await User.findOne({ username });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const user = new User({ username, password });
    await user.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Endpoint Login (Tidak memerlukan autentikasi)
router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    res.status(200).json({ token });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Endpoint untuk Melihat Semua Akun Login (Memerlukan autentikasi)
router.get("/all", protect, async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Endpoint untuk Menambah Akun (Memerlukan autentikasi)
router.post("/add", protect, async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = new User({ username, password });
    await user.save();
    res.status(201).json({ message: "User added successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Endpoint untuk Menghapus Akun (Memerlukan autentikasi)
router.delete("/delete/:id", protect, async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findByIdAndDelete(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ message: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
