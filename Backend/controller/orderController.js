import orderModel from "../models/Order.js";

export const getSellerOrders = async (req, res) => {
    try {
        const sellerId = req.user;
        if (!sellerId) return res.json({ success: false, message: 'User Not Authenticated' });

        const orders = await orderModel
            .find({ sellerId })
            .populate('buyerId', 'firstName')
            .populate('products.productId', 'subCategory mainCategory name');
        return res.json({ success: true, orders });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: 'Server Error' });
    }

}

export const getBuyerOrders = async (req, res) => {
    try {
        const buyerId = req.user;
        if (!buyerId) return res.json({ success: false, message: 'User Not Authenticated' });

        const orders = await orderModel
            .find({ buyerId })
            // .populate('buyerId', 'firstName')
            .populate('products.productId', 'name');
        return res.json({ success: true, orders });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: 'Server Error' });
    }

}

export const handleStatus = async (req, res) => {
    try {
        const userId = req.user;
        const orderId = req.params.id;
        const { orderStatus } = req.body;

        if (!userId) return res.json({ success: false, message: 'User Not Authenticated' });
        if (!orderId) return res.json({ success: false, message: 'Not Found' });

        const order = await orderModel.findOneAndUpdate(
            { sellerId: userId, _id: orderId },
            { orderStatus },
            { new: true }
        );

        return res.json({ success: true, message: `Order has been marked as ${orderStatus}` });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: 'Server Error' });
    }
}

export const searchOrder = async (req, res) => {
    try {
        const query = req.query.ordername;
        const userId = req.user; // From middleware

        // Get only the current user's orders
        const orders = await orderModel.find({ sellerId: userId }).populate('products.productId');

        // Filter orders by product name
        const filteredOrders = orders.filter(order =>
            order.products.some(product =>
                product.productId.name.toLowerCase().includes(query.toLowerCase())
            )
        );

        return res.json({ success: true, orders: filteredOrders });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: 'Internal server error' });
    }
};
