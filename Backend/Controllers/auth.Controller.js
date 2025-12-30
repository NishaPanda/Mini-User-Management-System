const userSchema = require("../Models/user.Schema");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const JWT_SECRET = process.env.JWT_SECRET;

async function register(req, res) {
    try {
        const { fullName, email, password, role } = req.body;


        const ExistingUser = await userSchema.findOne({ email: email });
        if (ExistingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await userSchema.create({
            fullName,
            email,
            password: hashedPassword,
            role
        })
        await newUser.save();

        const token = jwt.sign({ id: newUser._id }, JWT_SECRET, { expiresIn: "7d" });

        res.cookie("token", token, {
            httpOnly: true,
            secure: true,
            sameSite: "none",
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        res.status(201).json({
            message: "User registered successfully",
            user: {
                id: newUser._id,
                email: newUser.email,
                fullName: newUser.fullName,
                role: newUser.role

            }, token: token
        });



    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
        console.log(error);

    }
}

async function login(req, res) {
    try {
        const { email, password } = req.body;

        const user = await userSchema.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "User not found" });
        }
        if (!user.isActive) {
            return res.status(400).json({ message: "User is not active" });
        }

        const isPasswordMatched = await bcrypt.compare(password, user.password);
        if (!isPasswordMatched) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "7d" });

        res.cookie("token", token, {
            httpOnly: true,
            secure: true,
            sameSite: "none",
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        res.status(200).json({
            message: "User logged in successfully",
            user: {
                id: user._id,
                email: user.email,
                fullName: user.fullName,
                role: user.role
            },
            token: token
        });

    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
        console.log(error);
    }
}
async function logout(req, res) {
    try {
        res.clearCookie("token");
        res.status(200).json({ message: "User logged out successfully" });
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
        console.log(error);
    }
}

async function getCurrentUser(req, res) {
    try {
        const token = req.cookies.token;
        if (!token) {
            return res.status(400).json({ message: "Unauthorized" });
        }
        const decodedToken = jwt.verify(token, JWT_SECRET);
        const user = await userSchema.findById(decodedToken.id);
        if (!user) {
            return res.status(400).json({ message: "User not found" });
        }
        res.status(200).json({
            message: "User logged in successfully",
            user: {
                id: user._id,
                email: user.email,
                fullName: user.fullName,
                role: user.role,
            },
        });
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
        console.log(error);
    }
}

module.exports = { register, login, logout, getCurrentUser };
