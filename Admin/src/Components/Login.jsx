import React, { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  InputAdornment,
  IconButton,
} from '@mui/material';
import { Email, Lock, Visibility, VisibilityOff } from '@mui/icons-material';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
import {useDispatch} from 'react-redux';
import { setAdmin } from '../../../Frontend/src/redux/authSlice';

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();

  const handleTogglePassword = () => {
    setShowPassword((prev) => !prev);
  };

  const navigate = useNavigate();
  const url = 'http://localhost:3000';

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${url}/api/user/login`,
        { email, password },
        {
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true,
        }
      );
      const { success, message, role } = response.data;

      if (success) {
        if (role === 'admin') {
          toast.success(message || 'Login successful!');
          dispatch(setAdmin(response.data.user))
          navigate('/');
        } else {
          toast.error('Access denied: Only admin can log in.');
        }
      } else {
        toast.error(message || 'Login failed.');
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error(
        error.response?.data?.message || 'Something went wrong during login.'
      );
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        px: 2,
      }}
    >
      <Box
        sx={{
          position: 'relative',
          width: '350px',
          maxWidth: 400,
          bgcolor: 'background.paper',
          borderRadius: 3,
          boxShadow:
            '0 8px 24px rgba(102, 126, 234, 0.3), 0 4px 12px rgba(118, 75, 162, 0.2)',
          px: 4,
          py: 5,
          textAlign: 'center',
        }}
      >
        <Typography
          variant="h4"
          fontWeight={700}
          sx={{
            background: 'linear-gradient(90deg, #00c6ff, #0072ff)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            mb: 2,
          }}
        >
          Fun Store
        </Typography>
        <Typography variant="h6" mb={4} color="text.secondary">
          Login to your account
        </Typography>

        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Email"
            placeholder="example@gmail.com"
            type="email"
            variant="outlined"
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Email />
                </InputAdornment>
              ),
            }}
          />

          <TextField
            fullWidth
            label="Password"
            placeholder="Password"
            type={showPassword ? 'text' : 'password'}
            variant="outlined"
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Lock />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={handleTogglePassword}
                    edge="end"
                    aria-label="toggle password visibility"
                  >
                    {showPassword ? (
                      <VisibilityOff />
                    ) : (
                      <Visibility />
                    )}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{
              mt: 3,
              py: 1.8,
              borderRadius: 3,
              background:
                'linear-gradient(90deg, #667eea 0%, #764ba2 100%)',
              boxShadow:
                '0 4px 15px rgba(118, 75, 162, 0.4)',
              fontWeight: 'bold',
              fontSize: '1.1rem',
              textTransform: 'none',
              transition: 'all 0.3s ease',
              '&:hover': {
                background:
                  'linear-gradient(90deg, #5a67d8 0%, #6b46c1 100%)',
                boxShadow:
                  '0 6px 20px rgba(107, 70, 193, 0.6)',
              },
            }}
          >
            Login
          </Button>
        </form>
      </Box>
    </Box>
  );
};

export default Login;
