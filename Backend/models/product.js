import mongoose from "mongoose";
const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  price: {
    type: Number,
    required: true,
  },
  subCategory: {
    type: String,
  },
  mainCategory: {
    type: String,
  },
  discount: {
    type: Number,
    default:0
  },
  stock: {
    type: Number,
    default: 0,
  },
  sizes: [{
    type: String
  }],
  productimgs: [
    {
      type: String,
      public_id: String, // if using Cloudinary
    }
  ],
  reviews: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Review',
  }],
  sellerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Assuming you have a User model
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  }
});

const productModel = mongoose.model('Product', productSchema);
export default productModel; 
