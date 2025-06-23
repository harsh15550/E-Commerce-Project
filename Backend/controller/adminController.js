import orderModel from "../models/Order.js";
import productModel from "../models/product.js";
import reviewModel from "../models/review.js";
import userModel from "../models/user.js";

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

export const getAllOrders = async (req, res) => {
    try {
        // const sellerId = req.user;
        // if (!sellerId) return res.json({ success: false, message: 'User Not Authenticated' });

        const orders = await orderModel.find()
            .populate('buyerId', 'firstName')
            .populate('products.productId', 'subCategory mainCategory name')
            .populate('sellerId', 'firstName')
        return res.json({ success: true, orders });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: 'Server Error' });
    }
}

export const getReview = async (req, res) => {
    try {

        let review = await reviewModel.find().populate('productId').populate('userId', 'firstName');
        if (!review) return res.json({ success: false, messageL: 'Not Found' })

        return res.json({ success: true, review });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: 'Server Error' });
    }
}

export const getUsers = async (req, res) => {
    try {

        let users = await userModel.find({ role: { $ne: 'admin' } });
        if (!users) return res.json({ success: false, messageL: 'Not Found' })

        return res.json({ success: true, users });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: 'Server Error' });
    }
}

export const handleSellerPermission = async (req, res) => {
    try {
        const sellerId = req.params.id;
        const adminid = req.user;
        const { isVerifiedSeller } = req.body;

        if (!adminid) return res.json({ success: false, message: 'admin login first' })

        const updateSellerPermission = await userModel.findByIdAndUpdate(
            sellerId,
            { isVerifiedSeller },
            { new: true }
        );

        return res.json({ success: true, message: 'Permission updated' })
    } catch (error) {
        console.log(error);

    }
}

export const searchNameProduct = async (req, res) => {
    try {
        const query = req.query.name;

        const users = await userModel.find({
            firstName: { $regex: query.toString(), $options: 'i' }
        });

        const products = await productModel.find({
            name: { $regex: query.toString(), $options: 'i' }
        });

        const orders = await orderModel.find()
            .populate('products.productId')
            .populate({
                path: 'sellerId',
                select: 'firstName'
            });

        const filteredOrders = orders.filter(order =>
            order.sellerId.firstName.toLowerCase().includes(query.toString().toLowerCase())
        );

        return res.json({
            success: true,
            users,
            products,
            orders: filteredOrders
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: "Server error" });
    }
};

export const deleteOrder = async (req, res) => {
    try {
        const orderId = req.params.id;

        if (!orderId) return res.json({ success: false, message: 'Order Not Found' })
        const order = await orderModel.findByIdAndDelete(orderId)
        return res.json({ success: true, message: 'Order Deleted' });
    } catch (error) {
        console.log(error);

    }
}

export const deleteReview = async (req, res) => {
    try {
        const reviewId = req.params.id;

        if (!reviewId) return res.json({ success: false, message: 'Review Not Found' });

        const review = await reviewModel.findByIdAndDelete(reviewId);
        

        await productModel.updateOne(
            { reviews: reviewId },          
            { $pull: { reviews: reviewId } } 
        );

        return res.json({ success: true, message: 'Review Deleted' });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: 'Something went wrong' });
    }
};


export const deleteUser = async (req, res) => {
  try {
    const adminUser = req.user;

    // Check if the user is admin
    const admin = await userModel.findById(adminUser);
    
    if (!admin || admin.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }

    const userId = req.params.id;
    if (!userId) {
      return res.status(400).json({ success: false, message: 'User ID is required' });
    }

    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // 1. Delete all products uploaded by the user (if seller)
    const products = await productModel.find({ sellerId: userId });
    for (let product of products) {
      // Delete reviews related to each product
      await reviewModel.deleteMany({ productId: product._id });
    }
    await productModel.deleteMany({ sellerId: userId });

    // 2. Delete all reviews created by the user
    await reviewModel.deleteMany({ userId: userId });

    // 3. Delete all orders associated with the user (as buyer or seller)
    await orderModel.deleteMany({ $or: [{ buyerId: userId }, { sellerId: userId }] });

    // 4. Finally, delete the user
    await userModel.findByIdAndDelete(userId);

    return res.status(200).json({ success: true, message: "User and all related data deleted successfully." });

  } catch (error) {
    console.error("Error deleting user:", error);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};