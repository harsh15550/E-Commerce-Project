import express from "express";
import { authMiddleware } from "../middleware/auth.js";
import { getBuyerOrders, getSellerOrders, handleStatus, searchOrder } from "../controller/orderController.js";

const orderRouter = express.Router();

orderRouter.get('/sellerOrder', authMiddleware, getSellerOrders);
orderRouter.get('/buyerOrder', authMiddleware, getBuyerOrders);
orderRouter.get('/searchOrder', authMiddleware, searchOrder);
orderRouter.put('/status/:id', authMiddleware, handleStatus);

export default orderRouter;