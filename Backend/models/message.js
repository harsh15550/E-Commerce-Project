import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    receiver: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    conversationId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'conversation',
        required: true
    },
    content: {
        type: String,
        required: true
    },
    replyTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'message',
        default: null
    },
    timestamp: {
        type: Date,
        default: Date.now,
    }

});

const messageModel = mongoose.model('message', messageSchema);
export default messageModel;
