import React, { useState, useRef } from 'react';
import {
    Box,
    TextField,
    Typography,
    Button,
    Paper,
    InputAdornment,
    Dialog,
    DialogContent,
    DialogTitle,
    IconButton
} from '@mui/material';
import { Email, Close } from '@mui/icons-material';
import { toast } from 'react-toastify';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [otpSent, setOtpSent] = useState(false);
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [openOtpPopup, setOpenOtpPopup] = useState(false);
    const inputRefs = useRef([]);
    const url = 'http://localhost:3000';
    const [openResetPopup, setOpenResetPopup] = useState(false);
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const navigate = useNavigate();
    
    const handleSendOtp = async (e) => {
        e.preventDefault();
        if (!email) return toast.warning('Please Enter Email');
        
        try {
            const response = await axios.post(`${url}/api/otp/forgot-password`, { email });
            setOpenOtpPopup(true);
            setOtpSent(true);
        } catch (error) {
            console.log(error);
            toast.error('Failed to send OTP');
        }
    };

    const handleOtpChange = (value, index) => {
        if (!/^[0-9]?$/.test(value)) return;
        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        if (value && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (e, index) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handleVerifyOtp = async () => {
        const enteredOtp = otp.join('');

        if (enteredOtp.length !== 6) {
            return toast.warning('Enter 6-digit OTP');
        }

        try {
            const response = await axios.post(`${url}/api/otp/verify`, {
                email,
                otp: enteredOtp,
            });

            if (response.data.success) {
                toast.success('OTP verified successfully');
                setOpenOtpPopup(false);
                setOpenResetPopup(true);
            } else {
                toast.error('Invalid OTP');
            }
        } catch (err) {
            console.log(err);
            toast.error('Error verifying OTP');
        }
    };

    const handleResetPassword = async () => {
        if (!newPassword || !confirmPassword) {
            return toast.warning('Please fill all fields');
        }
        if (newPassword !== confirmPassword) {
            return toast.error("Passwords don't match");
        }

        try {
            const response = await axios.post(`${url}/api/otp/reset-password`, {
                email,
                newPassword,
            });

            if (response.data.success) {
                toast.success('Password reset successful');
                setOpenResetPopup(false);
                navigate('/login')
                // redirect to login page if needed
            } else {
                toast.error(response.data.message || 'Failed to reset password');
            }
        } catch (err) {
            toast.error('Error resetting password');
            console.log(err);
            
        }
    };


    return (
        <Box
            sx={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                bgcolor: '#f0f2f5',
                px: 2,
            }}
        >
            <Paper
                elevation={4}
                sx={{
                    width: 400,
                    px: 5,
                    py: 6,
                    borderRadius: 4,
                    textAlign: 'center',
                    backgroundColor: '#fff',
                    boxShadow: '0 8px 20px rgba(0,0,0,0.1)',
                }}
            >
                <Typography
                    variant="h4"
                    fontWeight="bold"
                    sx={{
                        background: 'linear-gradient(90deg, #4facfe, #00f2fe)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        mb: 2,
                    }}
                >
                    Reset Password
                </Typography>

                <Typography variant="body2" color="text.secondary" mb={4}>
                    Enter your email address to receive an OTP
                </Typography>

                <form onSubmit={handleSendOtp}>
                    <TextField
                        fullWidth
                        label="Email Address"
                        type="email"
                        variant="outlined"
                        placeholder="you@example.com"
                        margin="normal"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        disabled={otpSent}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <Email color="primary" />
                                </InputAdornment>
                            ),
                        }}
                    />

                    <Button
                        type="submit"
                        fullWidth
                        sx={{
                            mt: 3,
                            py: 1.5,
                            fontWeight: 'bold',
                            borderRadius: 3,
                            background: 'linear-gradient(to right, #667eea, #764ba2)',
                            color: '#fff',
                            '&:hover': {
                                background: 'linear-gradient(to right, #5a67d8, #6b46c1)',
                            },
                            boxShadow: '0 4px 15px rgba(118, 75, 162, 0.4)',
                        }}
                    >
                        Send OTP
                    </Button>
                </form>
            </Paper>

            {/* OTP Dialog */}
            <Dialog open={openOtpPopup} onClose={() => setOpenOtpPopup(false)}>
                <DialogTitle
                    sx={{
                        textAlign: 'center',
                        fontWeight: 600,
                        fontSize: '1.2rem',
                        background: 'linear-gradient(90deg, #00c6ff, #0072ff)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        position: 'relative',
                        pr: 5,
                    }}
                >
                    Enter OTP
                    <IconButton
                        onClick={() => setOpenOtpPopup(false)}
                        sx={{ position: 'absolute', top: 8, right: 8 }}
                    >
                        <Close />
                    </IconButton>
                </DialogTitle>

                <DialogContent
                    sx={{
                        py: 3,
                        px: 4,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                >
                    <Box sx={{ display: 'flex', gap: 1 }}>
                        {otp.map((digit, index) => (
                            <TextField
                                key={index}
                                value={digit}
                                onChange={(e) => handleOtpChange(e.target.value, index)}
                                onKeyDown={(e) => handleKeyDown(e, index)}
                                inputRef={(el) => (inputRefs.current[index] = el)}
                                inputProps={{
                                    maxLength: 1,
                                    style: {
                                        textAlign: 'center',
                                        fontSize: '1.5rem',
                                        width: '20px',
                                        height: '20px',
                                        borderRadius: '8px',
                                    },
                                }}
                            />
                        ))}
                    </Box>

                    <Button
                        fullWidth
                        variant="contained"
                        sx={{
                            mt: 3,
                            py: 1.4,
                            fontWeight: 'bold',
                            borderRadius: 3,
                            background: 'linear-gradient(to right, #667eea, #764ba2)',
                            color: '#fff',
                            '&:hover': {
                                background: 'linear-gradient(to right, #5a67d8, #6b46c1)',
                            },
                            boxShadow: '0 4px 15px rgba(118, 75, 162, 0.4)',
                        }}
                        onClick={handleVerifyOtp}
                    >
                        Verify OTP
                    </Button>
                </DialogContent>
            </Dialog>

            {/* Reset Password Dialog */}
            <Dialog
                open={openResetPopup}
                onClose={() => setOpenResetPopup(false)}
                PaperProps={{
                    sx: {
                        width: 400,
                        borderRadius: 4,
                    },
                }}
            >
                <DialogTitle
                    sx={{
                        textAlign: 'center',
                        fontWeight: 600,
                        fontSize: '1.2rem',
                        background: 'linear-gradient(90deg, #00c6ff, #0072ff)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        position: 'relative',
                        pr: 5,
                    }}
                >
                    Reset Your Password
                    <IconButton
                        onClick={() => setOpenResetPopup(false)}
                        sx={{ position: 'absolute', top: 8, right: 8 }}
                    >
                        <Close />
                    </IconButton>
                </DialogTitle>

                <DialogContent sx={{ px: 4, py: 3 }}>
                    <TextField
                        fullWidth
                        label="New Password"
                        type="password"
                        margin="dense"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                    />
                    <TextField
                        fullWidth
                        label="Confirm Password"
                        type="password"
                        margin="dense"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                    <Button
                        fullWidth
                        onClick={handleResetPassword}
                        sx={{
                            mt: 3,
                            py: 1.4,
                            fontWeight: 'bold',
                            borderRadius: 3,
                            fontSize: '0.95rem',
                            background: 'linear-gradient(to right, #667eea, #764ba2)',
                            color: '#fff',
                            '&:hover': {
                                background: 'linear-gradient(to right, #5a67d8, #6b46c1)',
                            },
                            boxShadow: '0 4px 15px rgba(118, 75, 162, 0.4)',
                        }}
                    >
                        Reset Password
                    </Button>
                </DialogContent>
            </Dialog>
        </Box>

    );
};

export default ForgotPassword;
