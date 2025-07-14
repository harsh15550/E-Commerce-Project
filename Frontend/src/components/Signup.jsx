import React, { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  FormControl
} from '@mui/material';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Link, useNavigate } from 'react-router-dom';
import bgImg from '../assets/loginbg.png'; // Replace with your own background
import { CircularProgress } from '@mui/material';

const roles = ['buyer', 'seller'];

const Signup = () => {
  const [firstName, setFirstName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const url = 'https://e-commerce-project-6wl4.onrender.com';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (password === confirmPassword) {
        const response = await axios.post(`${url}/api/user/register`, {
          firstName,
          email,
          password,
          role
        }, {
          headers: {
            'Content-Type': 'application/json'
          }
        });

        if (response.data.success) {
          setLoading(false);
          toast.success(response.data.message);
          navigate('/login');
        } else {
          toast.error(response.data.message);
        }
      } else {
        toast.error('Confirm password is incorrect.');
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
      {/* Blur Overlay */}
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

      {/* Signup Card */}
      <Paper
        elevation={3}
        sx={{
          position: 'relative',
          zIndex: 1,
          width: '450px',
          maxWidth: 500,
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
            fontFamily: 'cursive',
            background: 'linear-gradient(90deg, #00c6ff, #0072ff)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            mb: 2,
          }}
        >
          Fun Store
        </Typography>

        <Typography variant="body1" mb={3}>
          Create your account
        </Typography>

        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            label="First Name"
            fullWidth
            margin="normal"
            variant="outlined"
            size="small"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
          />
          <TextField
            label="Email"
            type="email"
            fullWidth
            margin="normal"
            variant="outlined"
            size="small"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <TextField
            label="Password"
            type="password"
            fullWidth
            margin="normal"
            variant="outlined"
            size="small"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <TextField
            label="Confirm Password"
            type="password"
            fullWidth
            margin="normal"
            variant="outlined"
            size="small"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />

          <Box sx={{ mt: 2, textAlign: 'left' }}>
            <FormControl required>
              <FormLabel>Select Role</FormLabel>
              <RadioGroup
                row
                name="role"
                value={role}
                onChange={(e) => setRole(e.target.value)}
              >
                {roles.map((r) => (
                  <FormControlLabel
                    key={r}
                    value={r}
                    control={<Radio />}
                    label={r.charAt(0).toUpperCase() + r.slice(1)}
                  />
                ))}
              </RadioGroup>
            </FormControl>
          </Box>

          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{
              mt: 3,
              py: 1.3,
              fontWeight: 'bold',
              fontSize: '16px',
              borderRadius: '6px',
              background: 'linear-gradient(to right, #667eea, #764ba2)',
              boxShadow: '0px 4px 20px rgba(118, 75, 162, 0.5)',
            }}
          >
            {loading ? (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }} >
                Please Wait
                <CircularProgress size={20} sx={{ color: 'white' }} />
              </Box>
            ) : (
              <>
                Create Account
              </>
            )}
          </Button>

          <Typography variant="body2" sx={{ mt: 2 }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: '#1976d2', textDecoration: 'underline' }}>
              Login here
            </Link>
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
};

export default Signup;
