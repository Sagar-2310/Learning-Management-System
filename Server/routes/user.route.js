import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";
import { isAuthenticated } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/register", async (req, res) => {
  try {
    const { fullName, email, password, role } = req.body; 
    if (!fullName || !email || !password || !role) {
      return res.status(400).json({ success: false, message: "All fields required" });
    }
    const existingUser = await User.findOne({ email: email.toLowerCase().trim() });
    if (existingUser) {
      return res.status(400).json({ success: false, message: "User already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    await User.create({
      fullName,
      email: email.toLowerCase().trim(),
      password: hashedPassword,
      role: role.toLowerCase().trim()
    });
    return res.status(201).json({ success: true, message: "Registered successfully" });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Registration failed" });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password, role } = req.body;
    const user = await User.findOne({ email: email.toLowerCase().trim() });
    
    if (!user || user.role.toLowerCase() !== role.toLowerCase()) {
      return res.status(400).json({ success: false, message: "Invalid credentials or role" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: "Invalid credentials" });
    }

    const token = jwt.sign(
        { userId: user._id }, 
        process.env.JWT_SECRET, 
        { expiresIn: '1d' }
    );

    return res.status(200).cookie("token", token, {
      httpOnly: true,
      sameSite: "lax",
      maxAge: 24 * 60 * 60 * 1000,
      secure: false
    }).json({
      success: true,
      message: `Welcome back ${user.fullName}`,
      user: { _id: user._id, fullName: user.fullName, email: user.email, role: user.role },
      token
    });

  } catch (error) {
    console.error("Login Error:", error);
    return res.status(500).json({ success: false, message: "Login failed" });
  }
});

router.post("/logout", (req, res) => {
  try {
    return res.status(200).cookie("token", "", { maxAge: 0 }).json({
      success: true,
      message: "Logged out successfully"
    });
  } catch (error) {
    return res.status(500).json({ success: false });
  }
});

router.get("/profile", isAuthenticated, async (req, res) => {
  try {
    const user = await User.findById(req.id).select("-password"); 
    return res.status(200).json({ success: true, user });
  } catch (error) {
    return res.status(500).json({ success: false });
  }
});

export default router;