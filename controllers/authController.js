const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const crypto = require('crypto')
const User = require('../models/User')

const generateToken = (userId) => {
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
        throw new Error('JWT_SECRET is not configured');
    }

    return jwt.sign(
        { userId },
        jwtSecret,
        { expiresIn: "7d" }
    );
};

const registerUser = async (req, res) => {
    try {
        const { name, mobile, password } = req.body || {};
        const normalizedName = typeof name === 'string' ? name.trim() : '';
        const normalizedMobile = typeof mobile === 'string' ? mobile.trim() : '';

        if (!normalizedName || !normalizedMobile || typeof password !== 'string' || !password) {
            return res.status(400).json({
                message: "Name, Mobile no. and password are required",
            });
        }

        const existingUser = await User.findOne({ mobile: normalizedMobile });

        if (existingUser) {
            return res.status(409).json(
                { message: "User already exists" }
            );
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            name: normalizedName,
            mobile: normalizedMobile,
            password: hashedPassword,
        });

        const token = generateToken(user._id);

        res.status(201).json({
            message: "user registered successfully",
            token,
            user: {
                id: user._id,
                name: user.name,
                mobile: user.mobile,
            },
        });

    }
    catch (error) {
        console.error("Registration failed:", error);
        res.status(500).json({
            message: "Registration failed",
        });
    };
};


const loginUser = async (req, res) => {
    try {
        const { mobile, password } = req.body;
        const normalizedMobile = typeof mobile === 'string' ? mobile.trim() : '';

        if (!normalizedMobile || typeof password !== 'string' || !password) {
            return res.status(400).json({
                message: 'Mobile and password are required'
            });
        }

        const user = await User.findOne({ mobile: normalizedMobile });

        if (!user) {
            return res.status(401).json({
                message: "Invalid mobile or password"
            });
        }

        const isPasswordCorrect = await bcrypt.compare(
            password,
            user.password
        );

        if (!isPasswordCorrect) {
            return res.status(401).json({
                message: "Invalid mobile or password"
            });


        }
        const token = generateToken(user._id)

        res.json({
            message: "Login successful",
            token,
            user: {
                id: user._id,
                name: user.name,
                mobile: user.mobile,
            },
        });
    }
    catch(error){
        console.error("Login failed:", error);
        res.status(500).json({
            message:"Login failed",
        });
    }
};

const loginWithDemoOtp = async (req, res) => {
    

    const { mobile, otp } = req.body || {};
    const normalizedMobile = typeof mobile === 'string' ? mobile.trim() : '';
    const demoOtp = '1234';

    if (!/^\d{10}$/.test(normalizedMobile) || typeof otp !== 'string' || otp !== demoOtp) {
        return res.status(401).json({
            message: 'Invalid mobile number or OTP',
        });
    }

    try {
        let user = await User.findOne({ mobile: normalizedMobile });

        if (!user) {
            const password = await bcrypt.hash(crypto.randomBytes(32).toString('hex'), 10);
            user = await User.create({
                mobile: normalizedMobile,
                password,
            });
        }

        const token = generateToken(user._id);

        return res.json({
            message: 'Login successful',
            token,
            user: {
                id: user._id,
                name: user.name,
                mobile: user.mobile,
            },
        });
    }
    catch (error) {
        console.error('Demo OTP login failed:', error);
        return res.status(500).json({
            message: 'Login failed',
        });
    }
};

module.exports = {
    registerUser,
    loginUser,
    loginWithDemoOtp,
}