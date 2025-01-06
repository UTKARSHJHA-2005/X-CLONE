import UserModel from "../models/user.model.js";
import { generateTokenAndSetCookie } from "../lib/utils/Generatetoken.js";
import bcrypt from "bcryptjs";

export const signup = async (req, res) => {
    try {
        const { Name, username, email, password } = req.body;
        // if (!Name || !username || !email || !password) {
        //     return res.status(400).json({ error: "All fields are required" });
        // }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        
        if (password.length < 8) {
            return res.status(400).json({ error: "Password must be at least 8 characters long" });
        }
        const existUser = await user.findOne({ username });
        if (existUser) {
            return res.status(400).json({ error: "Username already taken" });
        }
        const existEmail = await user.findOne({ email });
        if (existEmail) {
            return res.status(400).json({ error: "Email already registered" });
        }
        const salt = await bcrypt.genSalt(10);
        const hashPass = await bcrypt.hash(password, salt);
        const newUser = new user({ Name, username, email, password: hashPass });
        await newUser.save();
        generateTokenAndSetCookie(newUser._id, res);
        res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
        console.error("Signup Error:", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
};

export const login = async (req, res) => {
    try {
        const { username, password } = req.body;

        // Check if user exists
        const User = await UserModel.findOne({ username });
        if (!User) {
            return res.status(400).json({ error: "Invalid username or password" });
        }

        // Compare passwords
        const isPasswordMatch = await bcrypt.compare(password, User.password);
        if (!isPasswordMatch) {
            return res.status(400).json({ error: "Invalid username or password" });
        }

        // Generate token and set cookie
        generateTokenAndSetCookie(User._id, res);
        res.status(200).json({
            _id: User._id,
            Name: User.Name,
            username: User.username,
            email: User.email,
            followers: User.followers,
            following: User.following,
            profileimg: User.profileimg,
            coverimg: User.coverimg,
        });
    } catch (error) {
        console.error("Login Error:", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
};

export const logout = async (req, res) => {
    try {
        res.cookie("jwt", "", { maxAge: 0, httpOnly: true, secure: true });
        res.status(200).json({ message: "Logged out successfully" });
    } catch (error) {
        console.error("Logout Error:", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
};

export const getme = async (req, res) => {
    try {
        const User = await UserModel.findById(req.user._id).select("-password");
        res.status(200).json(User);
    } catch (error) {
        console.error("GetMe Error:", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
};
