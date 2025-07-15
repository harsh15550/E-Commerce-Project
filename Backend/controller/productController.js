import mongoose from "mongoose";
import cloudinary from "../index.js";
import productModel from "../models/product.js";
import reviewModel from "../models/review.js";
import userModel from "../models/user.js";
import orderModel from "../models/Order.js";
import streamifier from 'streamifier';

export const addProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      mainCategory,
      subCategory,
      stock,
      discount,
      sizes,
    } = req.body;

    const userId = req.user; // assuming you attach user in authMiddleware
    const files = req.files;

    const productimgs = [];

    for (let file of files) {
      const imageUrl = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: 'ecommerce/products',
            resource_type: 'image',
          },
          (error, result) => {
            if (result) resolve(result.secure_url);
            else reject(error);
          }
        );

        streamifier.createReadStream(file.buffer).pipe(uploadStream);
      });

      productimgs.push(imageUrl);
    }

    const newProduct = new productModel({
      name,
      description,
      price,
      mainCategory,
      subCategory,
      stock,
      productimgs,
      discount,
      sizes,
      sellerId: userId,
    });

    await newProduct.save();

    // Link product to user
    const user = await userModel.findById(userId);
    user.product.push(newProduct._id);
    await user.save();

    return res.json({
      success: true,
      message: 'Product added successfully',
      product: newProduct,
    });
  } catch (error) {
    console.error('Upload Error:', error);
    return res.status(500).json({ success: false, message: 'Server Error' });
  }
};

export const addReview = async (req, res) => {
    const userId = req.user;
    const productId = req.params.id;
    const { rating, comment } = req.body;

    const user = await userModel.findById(userId);
    const product = await productModel.findById(productId);

    if (!user) return res.json({ success: false, message: 'User Not Authenticated' });
    if (!product) return res.json({ success: false, message: 'Product Not Found' });

    try {
        // Check if review by this user already exists
        let existingReview = await reviewModel.findOne({ productId, userId });

        if (existingReview) {
            // Update existing review
            existingReview.rating = rating;
            existingReview.comment = comment;
            await existingReview.save();

            return res.json({
                success: true,
                message: 'Review updated successfully',
                review: existingReview
            });
        } else {
            // Create new review
            const newReview = new reviewModel({
                productId,
                userId,
                rating,
                comment
            });

            await newReview.save();

            // Add review reference to product
            product.reviews.push(newReview._id);
            await product.save();

            return res.json({
                success: true,
                message: 'Review added successfully',
                review: newReview
            });
        }

    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: 'Server Error' });
    }
};

export const getReview = async (req, res) => {
    try {
        const userId = req.user;
        const productId = req.params.id;

        if (!userId) return res.json({ success: false, message: 'User Not Authenticated' });
        if (!productId) return res.json({ success: false, message: 'Product Not Found' });

        let review = await reviewModel.findOne({ productId, userId });
        if (!review) return res.json({ success: false, messageL: 'Not Found' })

        return res.json({ success: true, review }); 

    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: 'Server Error' });
    }
}

export const getReviewsBySeller = async (req, res) => {
    try {
        const sellerId = req.user;

        const products = await productModel.find({ sellerId }).select('_id');

        const productIds = products.map((p) => p._id);

        const reviews = await reviewModel.find({ productId: { $in: productIds } })
            .populate('userId', 'firstName')
            .populate('productId', 'productimgs name');

        return res.status(200).json({ success: true, reviews });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to fetch reviews." });
    }
};

export const getProductDetail = async (req, res) => {
    const userId = req.user;
    
    const productId = req.params.id;

    try {
        const user = await userModel.findById(userId);
        const product = await productModel.findById(productId);

        if (!user) return res.json({ success: false, message: 'User Not Authenticated' });
        if (!product) return res.json({ success: false, message: 'Product Not Found' });

        await product.populate({
            path: 'reviews',
            populate: {
                path: 'userId',
                select: 'firstName lastName profileImage'
            },
            // path:'sellerId'
        });

        await product.save();

        return res.json({ success: true, product })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: 'Server Error' });
    }
}

export const getAllProduct = async (req, res) => {
    try {
        const products = await productModel.find().populate({
            path: 'reviews',
            populate: {
                path: 'userId',
                select: 'firstName lastName profileImage'
            }
        });

        if (!products || products.length === 0) {
            return res.json({ success: false, message: 'No Product Available' });
        }

        return res.json({ success: true, message: 'All Products', products });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: 'Server Error' });
    }
};

export const getSellerProducts = async (req, res) => {
    try {
        const userId = req.user;

        if (!userId) return res.json({ success: false, message: 'User Not Authenticated' });
        const products = await productModel.find({ sellerId: userId });
        if (!products) return res.json({ success: false, message: 'No Products Uploaded' });
        return res.json({ success: true, products });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: 'Server Error' });
    }
}

export const editProduct = async (req, res) => {
    try {
        const productId = req.params.id;
        const { name, description, mainCategory, subCategory, price, stock, discount } = req.body;

        // ⚠️ Note: req.body.existingImgs can be a string or array
        let existingImgs = req.body.existingImgs || [];
        if (typeof existingImgs === "string") {
            existingImgs = [existingImgs]; // convert to array
        }

        let uploadedImgs = [];

        // 👇 Upload new images to Cloudinary
        if (req.files && req.files.length > 0) {
            for (const file of req.files) {
                const result = await cloudinary.v2.uploader.upload(file.path, {
                    folder: "products",
                });
                uploadedImgs.push(result.secure_url);
                fs.unlinkSync(file.path);
            }
        }

        const finalImgs = [...existingImgs, ...uploadedImgs];

        const updatedProduct = await productModel.findByIdAndUpdate(
            productId,
            {
                name,
                description,
                mainCategory,
                subCategory,
                price,
                stock,
                discount,
                productimgs: finalImgs,
            },
            { new: true }
        );

        await updatedProduct.save();

        return res.json({
            success: true,
            updatedProduct,
            message: "Product Update Successful",
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: "Server Error" });
    }
};

export const deleteProduct = async (req, res) => {
    try {
        const productId = req.params.id;
        const userId = req.user;

        if (!userId) return res.json({ success: false, message: 'User Not Authenticated' });
        if (!productId) return res.json({ success: false, message: 'No Product Provided' });

        // 1. Delete the product
        const product = await productModel.findByIdAndDelete(productId);
        if (!product) return res.json({ success: false, message: 'Product not found' });

        // 2. Remove product from user's list
        await userModel.findByIdAndUpdate(userId, {
            $pull: { product: new mongoose.Types.ObjectId(productId) }
        });

        // 3. Delete all reviews related to the product
        await reviewModel.deleteMany({ productId });

        // 4. Handle product in orders:
        const orders = await orderModel.find({ "products.productId": productId });

        for (const order of orders) {
            await orderModel.findByIdAndDelete(order._id);
        }


        return res.json({ success: true, message: 'Product and related data deleted', product });

    } catch (error) {
        console.log("Delete Product Error:", error);
        return res.status(500).json({ success: false, message: 'Server Error' });
    }
};

export const searchProduct = async (req, res) => {
    try {
        const query = req.query.productname;

        const products = await productModel.find({
            name: { $regex: query.toString(), $options: 'i' },
            // sellerId: userId // assuming 'seller' field stores the owner's _id
        });

        return res.json({ success: true, products });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: "Something went wrong" });
    }
};
