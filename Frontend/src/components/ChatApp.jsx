import React, { useState, useEffect, useRef } from 'react';
import { Box, List, ListItem, ListItemText, TextField, IconButton } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { setMessage } from '../redux/chatSlice';
import useRTM from './useRTM';


const ChatApp = ({ sellerId }) => {
    useRTM();
    const [input, setInput] = useState('');
    const bottomRef = useRef(null);
    const dispatch = useDispatch();
    const { user } = useSelector(store => store.user);
    const userId = user._id;
    const { message } = useSelector(store => store.chat);


    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [message]);

    const handleSend = async () => {
        if (input.trim()) {
            const messageData = {
                senderId: userId,
                receiverId: sellerId,
                content: input
            };

            try {
                const res = await axios.post("http://localhost:3000/api/message/send", messageData, { withCredentials: true });

                if (res.data.success) {
                    const newMessage = {
                        ...res.data.data,
                        sender: { _id: user._id },
                    };

                    const updatedMessages = [...message, newMessage];

                    dispatch(setMessage(updatedMessages));
                    setInput('');
                }
            } catch (err) {
                console.error("Failed to send message:", err);
            }
        }
    };

    const getMessage = async () => {
        try {
            if (sellerId) {
                const response = await axios.get(`http://localhost:3000/api/message/getMessage/${sellerId}`, { withCredentials: true });
                
                if (response.data.success) {
                    dispatch(setMessage(response.data.data))
                }
            }
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        getMessage();
    }, [])


    return (
        <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
            {/* Messages */}
            <Box sx={{ flexGrow: 1, overflowY: "auto", scrollbarWidth: 'none', mb: 1 }}>
                <List>
                    {message?.map((msg, index) =>
                    (
                        <ListItem key={index} sx={{ justifyContent: userId === msg?.sender?._id ? "flex-end" : "flex-start" }}>
                            <ListItemText
                                primary={msg.content}
                                
                                secondary={new Date(msg.timestamp).toLocaleDateString('en-GB', {
                                    day: 'numeric',
                                    month: 'long',
                                    year: 'numeric'
                                })}
                                sx={{
                                    maxWidth: "70%",
                                    bgcolor: userId === msg?.sender?._id ? "#e0f7fa" : "#f0f0f0",
                                    p: 1,
                                    borderRadius: 2,
                                }}
                            />
                        </ListItem>
                    ))}
                    <div ref={bottomRef} />
                </List>
            </Box>

            {/* Input box */}
            <Box sx={{ display: "flex", gap: 1 }}>
                <TextField
                    variant="outlined"
                    fullWidth
                    size="small"
                    placeholder="Type a message..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSend()}
                />
                <IconButton color="primary" onClick={handleSend}>
                    <SendIcon />
                </IconButton>
            </Box>
        </Box>
    );
};

export default ChatApp;
