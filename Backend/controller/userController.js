import userModel from "../models/user.js";
import bcrypt from 'bcrypt';
import jwt from "jsonwebtoken";
import validator from 'validator';
import cloudinary from "../index.js";

export const register = async (req, res) => {
    try {

        const { firstName, email, password, role } = req.body;

        const user = await userModel.findOne({ email });
        if (user) return res.json({ success: false, message: 'User Already Exist' });

        if (!validator.isEmail(email)) {
            return res.json({ success: false, message: 'User Already Exist' });
        }

        if (password.length < 6) {
            return res.json({ success: false, message: 'Password must be at least 6 characters long' });
        }

        bcrypt.genSalt(10, function (err, salt) {
            bcrypt.hash(password, salt, async function (err, hash) {
                // Store hash in your password DB.
                const newUser = new userModel({
                    firstName,
                    email,
                    password: hash,
                    role
                });
                await newUser.save();

                return res.json({ success: true, message: 'User Register Successful' })
            });
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: 'Server Error' });
    }
}

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await userModel.findOne({ email });

        if (!user) {
            return res.json({ success: false, message: 'User or Password is incorrect' });
        }

        bcrypt.compare(password, user.password, function (err, result) {
            if (result) {
                const token = jwt.sign(
                    { id: user._id, role: user.role }, // include role in token
                    process.env.secretKey,
                    { expiresIn: '7d' }
                );

                res.cookie('token', token, {
                    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
                    httpOnly: true,
                    secure: process.env.NODE_ENV === "production", // for secure deployment
                });

                // Check role and send response accordingly
                if (user.role === "admin") {
                    return res.json({
                        success: true,
                        message: 'Admin Login Successful',
                        role: 'admin',
                        user
                    });
                } else {
                    return res.json({
                        success: true,
                        message: 'Login Successful',
                        user
                    });
                }
            } else {
                return res.json({ success: false, message: 'User or Password is incorrect' });
            }
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: 'Server Error' });
    }
};

export const logout = async (req, res) => {
    try {
        res.clearCookie('token');
        return res.json({ success: true, message: 'Logout successful' });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: 'Server Error' });
    }
}

export const editProfile = async (req, res) => {
    try {
        const userId = req.user;
        const { firstName, lastName, phone, address, storeName, storeDescription, gstNumber } = req.body;

        const user = await userModel.findById(userId);
        if (!user) return res.json({ success: false, message: 'User Not Authenticated' });

        let profileImage = user.profileImage;

        // 👇 Upload profile image to Cloudinary if a new file is uploaded
        if (req.files && req.files['profileImage'] && req.files['profileImage'][0]) {
            const result = await cloudinary.uploader.upload(req.files['profileImage'][0].path, {
                folder: 'uploads',
            });
            profileImage = result.secure_url;
        }

        const updatedProfile = await userModel.findByIdAndUpdate(
            userId,
            {
                firstName,
                lastName,
                phone,
                address,
                profileImage,
                storeName,
                storeDescription,
                gstNumber
            },
            { new: true }
        );

        await updatedProfile.save();

        return res.json({ success: true, message: "Profile updated successfully", updatedProfile });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: 'Server Error' });
    }
}

export const handleFavoriteToggle = async (req, res) => {
    try {
        const userId = req.user;
        const postId = req.params.id;

        if (!userId) return res.json({ success: false, message: 'User not authenticated.' });
        if (!postId) return res.json({ success: false, message: 'Post ID not provided.' });
        
        const user = await userModel.findById(userId);

        if (!user) return res.json({ success: false, message: 'User not found.' });

        const isFavourite = user.favourite.includes(postId);

        let updatedUser;

        if (isFavourite) {
            // Remove post from favorites
            updatedUser = await userModel.findByIdAndUpdate(
                userId,
                { $pull: { favourite: postId } },
                { new: true }
            );
            return res.json({ success: true, message: 'Product removed from favorites.' });
        } else {
            // Add post to favorites
            updatedUser = await userModel.findByIdAndUpdate(
                userId,
                { $addToSet: { favourite: postId } }, // prevents duplicate entries
                { new: true }
            );
            return res.json({ success: true, message: 'Product added to favorites.' });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: 'Server Error' });
    }
};

export const getFavoriteProducts = async (req, res) => {
    try {
        const userId = req.user;
        if (!userId) return res.status(400).json({ success: false, message: 'User not authenticated.' });

        const user = await userModel.findById(userId);
        await user.populate('favourite');

        return res.status(200).json({success: true, favourite : user.favourite})
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: 'Server Error' });
    }
}


// ======== Admin =========
