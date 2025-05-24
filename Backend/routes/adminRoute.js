import express from "express";
import { deleteOrder, deleteReview, deleteUser, getAllOrders, getAllProduct, getReview, getUsers, handleSellerPermission, searchNameProduct } from "../controller/adminController.js";
import { authMiddleware } from "../middleware/auth.js";

const adminRouter = express.Router();

adminRouter.get('/order', getAllOrders);
adminRouter.get('/users', getUsers);
adminRouter.get('/search', searchNameProduct);
adminRouter.put('/permission/:id', authMiddleware, handleSellerPermission);
adminRouter.get('/review', getReview);
adminRouter.get('/product', getAllProduct);
adminRouter.delete('/deleteOrder/:id', deleteOrder);
adminRouter.delete('/deleteReview/:id', deleteReview);
adminRouter.delete('/deleteUser/:id', authMiddleware ,deleteUser);

export default adminRouter;