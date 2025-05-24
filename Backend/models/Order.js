import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
    buyerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    sellerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    products: [
        {
            productId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Product',
                required: true
            },
            quantity: {
                type: Number,
                required: true
            },
            price: {
                type: Number,
                required: true
            },
            productSize: {
                type: String,
                require: true
            },
            image: {
                type: String
            }
        }
    ],
    totalAmount: {
        type: Number,
        required: true
    },
    paymentStatus: {
        type: String,
        enum: ['pending', 'paid'],
        default: 'pending'
    },

    // ✅ Delivery Information Fields
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
    },
    email: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    state: {
        type: String,
        required: true
    },
    pincode: {
        type: String,
        required: true
    },
    alternatePincode: {
        type: String
    },
    phone: {
        type: String,
        required: true
    },

    stripeSessionId: {
        type: String
    },

    orderStatus: {
        type: String,
        enum: ['pending', 'shipped', 'cancelled'],
        default: 'pending'
    }
}, { timestamps: true });

const orderModel = mongoose.model('Order', orderSchema);
export default orderModel;
