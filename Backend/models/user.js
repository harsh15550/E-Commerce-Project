import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['buyer', 'seller', 'admin'], 
        default: 'buyer'
    },
    product: [{
        type: mongoose.Schema.Types.ObjectId,
        ref:'Product'
    }],
    favourite: [{
        type: mongoose.Schema.Types.ObjectId,
        ref:'Product'
    }],

    // 👇 Common for all users
    phone: { type: String },
    address: { type: String },
    profileImage: { type: String }, // optional

    // 👇 Specific to Sellers
    storeName: { type: String },
    storeDescription: { type: String },
    gstNumber: { type: String }, // optional
    isVerifiedSeller: {
        type: Boolean,
        default: false
    },

    // 👇 Admin-only flags (optional)
    isBlocked: {
        type: Boolean,
        default: false
    },

    createdAt: {
        type: Date,
        default: Date.now
    }
});

const userModel = mongoose.model('User', userSchema);
export default userModel;
