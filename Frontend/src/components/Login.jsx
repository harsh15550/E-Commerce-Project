import React, { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  InputAdornment,
  IconButton,
  Paper,
  CircularProgress
} from '@mui/material';
import { Email, Lock, Visibility, VisibilityOff } from '@mui/icons-material';
import { Link, useNavigate } from 'react-router-dom';
import bgImg from '../assets/loginbg.png';
import { toast } from 'react-toastify';
import { setUser } from '../redux/authSlice';
import { useDispatch } from 'react-redux';
import axios from 'axios';

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const url = 'https://e-commerce-project-6wl4.onrender.com';

  const handleTogglePassword = () => {
    setShowPassword((prev) => !prev);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post(`${url}/api/user/login`, {
        email,
        password,
      }, {
        headers: {
          'Content-Type': 'application/json'
        },
        withCredentials: true
      });

      if (response.data.success) {
        toast.success(response.data.message);
        setLoading(false);
        navigate('/');
        dispatch(setUser(response.data.user));
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        backgroundImage: `url(${bgImg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
          backgroundColor: 'rgba(0, 0, 0, 0.3)',
          zIndex: 0,
        }}
      />

      {/* Login Box */}
      <Paper
        elevation={3}
        sx={{
          position: 'relative',
          zIndex: 1,
          width: '370px',
          maxWidth: 420,
          px: 4,
          py: 5,
          borderRadius: 3,
          textAlign: 'center',
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
        }}
      >
        <Typography
          variant="h4"
          fontWeight={700}
          color="primary"
          sx={{
            background: 'linear-gradient(90deg, #00c6ff, #0072ff)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            mb: 2,
          }}
        >
          Fun Store
        </Typography>
        <Typography variant="body1" mb={3}>
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
            type={showPassword ? 'text' : 'password'}
            variant="outlined"
            placeholder="Password"
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
                  <IconButton onClick={handleTogglePassword} edge="end">
                    {showPassword ? <VisibilityOff /> : <Visibility />}
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
              py: 1.5,
              borderRadius: 2,
              background: 'linear-gradient(to right, #667eea, #764ba2)',
              boxShadow: '0px 4px 20px rgba(118, 75, 162, 0.5)',
              fontWeight: 'bold',
            }}
          >
            {loading ? (
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }} >
                            Please Wait
                            <CircularProgress size={20} sx={{ color: 'white' }} />
                          </Box>
                        ) : (
                          <>
                            Login
                          </>
                        )}
          </Button>

          {/* Forgot Password Button */}
          <Button
            onClick={() => navigate('/forgot-password')}
            fullWidth
            sx={{
              mt: 1,
              textTransform: 'none',
              color: '#0072ff',
              fontWeight: 500,
              fontSize: '0.95rem',
              backgroundColor: 'transparent',
              '&:hover': {
                textDecoration: 'underline',
                backgroundColor: 'transparent',
              },
            }}
          >
            Forgot Password?
          </Button>
        </form>

        <Typography mt={1} fontSize="0.9rem">
          Don’t have an account?{' '}
          <Link
            to="/signup"
            style={{ color: '#1976d2', textDecoration: 'underline' }}
          >
            Create here
          </Link>
        </Typography>
      </Paper>
    </Box>
  );
};

export default Login;
