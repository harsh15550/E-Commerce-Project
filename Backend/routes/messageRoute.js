import express from "express";
import { authMiddleware } from "../middleware/auth.js";
import { createMessage, getMessage, getUsersWhoMessagedSeller } from "../controller/messageController.js";

const messageRouter = express.Router();

messageRouter.post('/send', authMiddleware, createMessage);
messageRouter.get('/getMessage/:id', authMiddleware, getMessage);
messageRouter.get('/users-who-sent-messages', authMiddleware, getUsersWhoMessagedSeller);

export default messageRouter;