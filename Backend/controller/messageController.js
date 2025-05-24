import mongoose from "mongoose";
import conversationModel from "../models/Conversation.js";
import messageModel from "../models/message.js";
import userModel from "../models/user.js";
import { io, userSocketMap } from "../socket/socket.js";

export const createMessage = async (req, res) => {
    try {
        const { receiverId, content, replyTo } = req.body;
        const senderId = req.user;

        // 1. Check if conversation exists
        let conversation = await conversationModel.findOne({
            $or: [
                { senderId, receiverId },
                { senderId: receiverId, receiverId: senderId }
            ]
        });

        // 2. Create conversation if not exists
        if (!conversation) {
            conversation = await conversationModel.create({
                senderId,
                receiverId,
                messages: []
            });
        }

        // 3. Create message
        const message = await messageModel.create({
            content,
            sender: senderId,
            receiver: receiverId,
            conversationId: conversation._id,
            replyTo: replyTo || null,
        });

        console.log(message);
        

        // 4. Push message ID to conversation
        conversation.messages.push(message._id);
        await conversation.save();

        const receiverSocketId = userSocketMap[receiverId];
        if (receiverSocketId) {
            io.to(receiverSocketId).emit('newMessage', {
                content,
                senderId,
                receiverId,
                conversationId: conversation._id,
                replyTo: message.replyTo || null,
                timestamp: new Date()
            });
        }

        res.status(201).json({
            success: true,
            message: "Message sent successfully",
            data: message
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to send message",
            error: error.message
        });
    }
};

export const getMessage = async (req, res) => {
    try {
        const senderId = req.user;

        const receiverId = req.params.id;

        // 1. Find the conversation between the two users
        const conversation = await conversationModel.findOne({
            $and: [
                { senderId: { $in: [senderId, receiverId] } },
                { receiverId: { $in: [senderId, receiverId] } }
            ]
        });


        if (!conversation) {
            return res.status(404).json({
                success: false,
                message: "No conversation found between these users",
                data: []
            });
        }

        // 2. Fetch messages for this conversation
        const messages = await messageModel
            .find({ conversationId: conversation._id })
            .populate("sender", "firstName") // optional: populate sender name
            .populate("replyTo")        // optional: populate replied message

        res.status(200).json({
            success: true,
            message: "Messages fetched successfully",
            data: messages
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch messages",
            error: error.message
        });
    }
};

export const getUsersWhoMessagedSeller = async (req, res) => {
    try {
        const sellerId = req.user;

        if (!sellerId) {
            return res.status(400).json({ success: false, message: 'Not Authenticated' });
        }

        const sellerObjectId = new mongoose.Types.ObjectId(sellerId);

        const messages = await messageModel.aggregate([
            { $match: { receiver: sellerObjectId } },
            { $sort: { timestamp: -1 } },
            {
                $group: {
                    _id: '$sender',
                    lastMessage: { $first: '$content' },
                    sentAt: { $first: '$timestamp' }
                }
            }
        ]);

        const senderIds = messages.map(msg => msg._id);

        const users = await userModel.find({ _id: { $in: senderIds } });

        const result = messages.map(msg => {
            const user = users.find(u => u._id.toString() === msg._id.toString());
            return {
                user,
                lastMessage: msg.lastMessage,
                sentAt: msg.sentAt
            };
        });

        return res.status(200).json({ success: true, data: result });

    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};