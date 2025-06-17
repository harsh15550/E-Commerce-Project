import React from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  useMediaQuery,
  useTheme,
} from '@mui/material';

const SubscriptionSection = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const handleSubmit = (e) => {
    e.preventDefault();
  }

  return (
    <Paper
      elevation={3}
      sx={{
        mt: 8,
        py: 6,
        mr:3,
        px: 3,
        backgroundColor: '#f9f9f9',
        borderRadius: '20px 20px 0 0',
        textAlign: 'center',
      }}
    >
      <Typography variant="h4" fontWeight={600} gutterBottom>
        Subscribe & Stay Updated
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Get exclusive offers, product updates, and early access to deals.
      </Typography>

      <Box
      onSubmit={handleSubmit}
        component="form"
        noValidate
        autoComplete="off"
        sx={{
          display: 'flex',
          flexDirection: isMobile ? 'column' : 'row',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 2,
          maxWidth: 600,
          mx: 'auto',
        }}
      >
        <TextField
          fullWidth
          type="email"
          placeholder="Enter your email"
          variant="outlined"
          size="medium"
          sx={{
            backgroundColor: '#fff',
            borderRadius: 2,
            flex: 1,
          }}
        />
        <Button
          type="submit"
          variant="contained"
          color="primary"
          sx={{ px: 4, py: 1.5, fontWeight: 'bold', borderRadius: 2 }}
        >
          Subscribe
        </Button>
      </Box>

      <Typography variant="caption" color="text.secondary" sx={{ mt: 2, display: 'block' }}>
        You can unsubscribe at any time.
      </Typography>
    </Paper>
  );
};

export default SubscriptionSection;
