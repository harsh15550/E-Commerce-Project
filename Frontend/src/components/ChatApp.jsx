import React, { useState, useEffect, useRef } from 'react';
import {
    Box,
    List,
    ListItem,
    ListItemText,
    TextField,
    IconButton,
    Typography,
    Avatar,
    Chip,
    Paper,
    Divider
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import EmojiEmotionsIcon from '@mui/icons-material/EmojiEmotions';
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

    const formatTime = (timestamp) => {
        return new Date(timestamp).toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
        });
    };

    const formatDate = (timestamp) => {
        return new Date(timestamp).toLocaleDateString('en-GB', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
    };

    const shouldShowDateDivider = (currentMsg, prevMsg) => {
        if (!prevMsg) return true;
        const currentDate = new Date(currentMsg.timestamp).toDateString();
        const prevDate = new Date(prevMsg.timestamp).toDateString();
        return currentDate !== prevDate;
    };

    return (
        <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>


            {/* Messages */}
            <Box sx={{
                flexGrow: 1,
                overflowY: "auto",
                scrollbarWidth: 'thin',
                '&::-webkit-scrollbar': {
                    width: '6px',
                },
                '&::-webkit-scrollbar-thumb': {
                    backgroundColor: 'rgba(0,0,0,0.2)',
                    borderRadius: '3px',
                },
                bgcolor: '#f5f5f5',
                p: 1
            }}>
                <List sx={{ p: 0 }}>
                    {message?.map((msg, index) => {
                        const isOwn = userId === msg?.sender?._id;
                        const showDateDivider = shouldShowDateDivider(msg, message[index - 1]);

                        return (
                            <React.Fragment key={index}>
                                {/* Date Divider */}
                                {showDateDivider && (
                                    <ListItem sx={{ justifyContent: 'center', py: 2 }}>
                                        <Chip
                                            label={formatDate(msg.timestamp)}
                                            size="small"
                                            sx={{
                                                bgcolor: 'background.paper',
                                                color: 'text.secondary',
                                                fontSize: '0.75rem',
                                                fontWeight: 500
                                            }}
                                        />
                                    </ListItem>
                                )}

                                {/* Message */}
                                <ListItem
                                    sx={{
                                        justifyContent: isOwn ? "flex-end" : "flex-start",
                                        pb: 0.5,
                                        pt: 0.5
                                    }}
                                >
                                    <Box sx={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: isOwn ? 'flex-end' : 'flex-start',
                                        maxWidth: '75%'
                                    }}>
                                        <Paper
                                            elevation={2}
                                            sx={{
                                                p: 1.5,
                                                borderRadius: isOwn ? '20px 20px 4px 20px' : '20px 20px 20px 4px',
                                                bgcolor: isOwn ? 'primary.main' : 'background.paper',
                                                color: isOwn ? 'primary.contrastText' : 'text.primary',
                                                position: 'relative',
                                                '&::before': {
                                                    content: '""',
                                                    position: 'absolute',
                                                    width: 0,
                                                    height: 0,
                                                    ...(isOwn ? {
                                                        right: -8,
                                                        bottom: 8,
                                                        borderLeft: '8px solid',
                                                        borderLeftColor: 'primary.main',
                                                        borderTop: '8px solid transparent',
                                                        borderBottom: '8px solid transparent',
                                                    } : {
                                                        left: -8,
                                                        bottom: 8,
                                                        borderRight: '8px solid',
                                                        borderRightColor: 'background.paper',
                                                        borderTop: '8px solid transparent',
                                                        borderBottom: '8px solid transparent',
                                                    }),
                                                },
                                            }}
                                        >
                                            <Typography variant="body2" sx={{ wordWrap: 'break-word' }}>
                                                {msg.content}
                                            </Typography>
                                        </Paper>

                                        <Typography
                                            variant="caption"
                                            color="text.secondary"
                                            sx={{ mt: 0.5, mx: 1, fontSize: '0.7rem' }}
                                        >
                                            {formatTime(msg.timestamp)}
                                        </Typography>
                                    </Box>
                                </ListItem>
                            </React.Fragment>
                        );
                    })}
                    <div ref={bottomRef} />
                </List>
            </Box>

            {/* Input Area */}
            <Paper elevation={3} sx={{ p: 2, borderRadius: 0 }}>
                <Box sx={{ display: "flex", gap: 1, alignItems: 'flex-end' }}>
                    

                    <TextField
                        variant="outlined"
                        fullWidth
                        size="small"
                        placeholder="Type a message..."
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
                        multiline
                        maxRows={4}
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                borderRadius: '8px',
                                bgcolor: 'grey.50',
                                '& fieldset': {
                                    borderColor: 'grey.300',
                                },
                                '&:hover fieldset': {
                                    borderColor: 'primary.main',
                                },
                                '&.Mui-focused fieldset': {
                                    borderColor: 'primary.main',
                                },
                            },
                        }}
                    />

                    <IconButton
                        color="primary"
                        onClick={handleSend}
                        disabled={!input.trim()}
                        sx={{
                            bgcolor: input.trim() ? 'primary.main' : 'grey.300',
                            color: 'white',
                            '&:hover': {
                                bgcolor: input.trim() ? 'primary.dark' : 'grey.400',
                            },
                            '&.Mui-disabled': {
                                bgcolor: 'grey.300',
                                color: 'grey.500',
                            },
                            width: 40,
                            height: 40,
                        }}
                    >
                        <SendIcon />
                    </IconButton>
                </Box>
            </Paper>
        </Box>
    );
};

export default ChatApp;