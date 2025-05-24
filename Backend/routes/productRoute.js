import express from 'express';
import { addProduct, addReview, deleteProduct, editProduct, getAllProduct, getProductDetail, getReview, getReviewsBySeller, getSellerProducts, searchProduct } from '../controller/productController.js';
import { authMiddleware } from '../middleware/auth.js';
import { upload } from '../middleware/multer.js';

const productRoute = express.Router();

productRoute.post('/addProduct', upload.array('productimgs'), authMiddleware, addProduct);
productRoute.post('/addReview/:id', authMiddleware, addReview);
productRoute.get('/productDetail/:id', authMiddleware, getProductDetail);
productRoute.get('/getReview/:id', authMiddleware, getReview);
productRoute.get('/getAllProduct', getAllProduct);
productRoute.get('/getReview', authMiddleware, getReviewsBySeller);
productRoute.get('/searchProduct', authMiddleware,searchProduct);
productRoute.get('/getSellerProduct', authMiddleware, getSellerProducts);
productRoute.put('/editProduct/:id', upload.array("newImgs"), authMiddleware, editProduct);
productRoute.delete('/deleteProduct/:id', authMiddleware, deleteProduct);

export default productRoute