import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
    try {
        const { fullName, email, password, role } = req.body;
        if (!fullName || !email || !password || !role) {
            return res.status(400).json({ success: false, message: "All fields are required." });
        }
        const userExists = await User.findOne({ email: email.toLowerCase().trim() });
        if (userExists) {
            return res.status(400).json({ success: false, message: "User already exists." });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        await User.create({
            fullName,
            email: email.toLowerCase().trim(),
            password: hashedPassword,
            role: role.toLowerCase().trim() 
        });
        return res.status(201).json({ success: true, message: "Account created successfully." });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Failed to register." });
    }
};

export const login = async (req, res) => {
    try {
        const { email, password, role } = req.body;
        if (!email || !password || !role) {
            return res.status(400).json({ success: false, message: "All fields are required." });
        }

        const user = await User.findOne({ email: email.toLowerCase().trim() });
        if (!user) return res.status(400).json({ success: false, message: "User not found." });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ success: false, message: "Incorrect password." });

        if (role.toLowerCase().trim() !== user.role.toLowerCase().trim()) {
            return res.status(400).json({ success: false, message: "Invalid role." });
        }

        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });

        return res.status(200).cookie("token", token, { 
            maxAge: 86400000, 
            httpOnly: true, 
            sameSite: 'lax',
            secure: false 
        }).json({
            success: true,
            message: `Welcome back ${user.fullName}`,
            user: { _id: user._id, fullName: user.fullName, email: user.email, role: user.role },
            token 
        });
    } catch (error) {
        console.error("Login Error:", error);
        return res.status(500).json({ success: false, message: "Internal Error" });
    }
};

export const logout = async (req, res) => {
    try {
        return res.status(200).cookie("token", "", { maxAge: 0 }).json({
            message: "Logged out successfully.",
            success: true
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Failed to logout." });
    }
};