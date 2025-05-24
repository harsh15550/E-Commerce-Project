import express from "express";
import { handleFavoriteToggle, editProfile, login, logout, register, getFavoriteProducts } from "../controller/userController.js";
import { authMiddleware } from "../middleware/auth.js";
import { upload } from "../middleware/multer.js";
const userRoute = express.Router();

userRoute.post('/register', register);
userRoute.post('/login', login);
userRoute.post('/logout', logout);
userRoute.post('/favorite/:id', authMiddleware, handleFavoriteToggle);
userRoute.get('/getfavorite', authMiddleware, getFavoriteProducts);
userRoute.post('/edit', upload.fields([{ name: 'profileImage', maxCount: 1 }]), authMiddleware, editProfile);

export default userRoute;