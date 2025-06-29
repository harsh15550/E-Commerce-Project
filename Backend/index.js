import express from "express";
import cors from 'cors';
import mongoose from "mongoose";
import userRoute from "./routes/userRoute.js";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import productRoute from "./routes/productRoute.js";
import path from 'path';
import { fileURLToPath } from 'url';
import { v2 as cloudinary } from 'cloudinary';
import paymentrouter from "./routes/paymentRoutes.js";
import dotenv from "dotenv";
import orderRouter from "./routes/orderRoute.js";
import adminRouter from "./routes/adminRoute.js";
import { server, app } from "./socket/socket.js";
import messageRouter from "./routes/messageRoute.js";
import otpRouter from "./routes/otpRoute.js";
dotenv.config();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

export default cloudinary;

dotenv.config();

// const app = express();
const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URL)
    .then(() => console.log('DB CONNECTED'))
    .catch(() => console.log('Not Connected')
    )

app.use(cors({
    origin: ['http://localhost:5173', 'http://localhost:5174', 'e-commerce-project-frontend-bay.vercel.app'],
    credentials: true
}))

// middleware 
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/receipts', express.static(path.join(__dirname, 'receipts')));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());


// Routes 
app.use('/api/payment', paymentrouter);
app.use(express.json());
app.use('/api/user', userRoute);
app.use('/api/order', orderRouter);
app.use('/api/product', productRoute);
app.use('/api/admin', adminRouter);
app.use('/api/message', messageRouter);
app.use('/api/otp', otpRouter);

server.listen(PORT, () => {
    console.log('Your Server Is Running On PORT No', PORT);
})

