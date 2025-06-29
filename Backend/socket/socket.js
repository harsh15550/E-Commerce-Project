// socket/socket.js
import { Server } from 'socket.io';
import http from 'http';
import express from 'express';

const app = express();
export const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: ['http://localhost:5173', 'https://e-commerce-project-frontend-bay.vercel.app'],
        methods: ['GET', 'POST']
    }
});

const userSocketMap = {}; // 👈 Map userId -> socketId

io.on('connection', (socket) => {
    const userId = socket.handshake.query.userId;
    
    if (userId) {
        userSocketMap[userId] = socket.id;
        console.log('User connected:', userId, 'Socket ID:', socket.id);
    }

    socket.on('send_message', (data) => {
        io.emit('receive_message', data);
    });

    socket.on('disconnect', () => {
        for (let uid in userSocketMap) {
            if (userSocketMap[uid] === socket.id) {
                delete userSocketMap[uid];
                console.log('User disconnected:', uid);
                break;
            }
        }
    });
});

export { app, io, userSocketMap  };
