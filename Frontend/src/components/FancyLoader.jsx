import React from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';

const FancyLoader = ({ message = "Loading your experience..." }) => {
  return (
    <Box
      sx={{
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #ffffff, #f5f5f5)',
        color: '#333',
      }}
    >
      <Box
        sx={{
          animation: 'pulse 2s infinite',
          mb: 2,
          display: 'flex',
          alignItems: 'center',
          gap: 1,
        }}
      >
        <ShoppingCartIcon sx={{ fontSize: 50, color: '#1976d2' }} />
        <CircularProgress
          size={50}
          thickness={4}
          sx={{
            color: '#1976d2',
            position: 'relative',
          }}
        />
      </Box>

      <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
        {message}
      </Typography>

      <style>{`
        @keyframes pulse {
          0% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.05); opacity: 0.7; }
          100% { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </Box>
  );
};

export default FancyLoader;
