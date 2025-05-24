import mongoose from "mongoose";

const conversationSchema = new mongoose.Schema({
    senderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    receiverId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    messages: [{
        type: mongoose.Schema.Types.ObjectId,
        ref:'message'
    }]
})

const conversationModel = mongoose.model('conversation', conversationSchema);
export default conversationModel;