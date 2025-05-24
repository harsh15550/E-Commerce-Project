import React from 'react';
import { Box, Button, Container, Grid, TextField, Typography, Divider } from '@mui/material';

const Payment = () => {
  return (
    <Container maxWidth="lg" sx={{ mt: 5, mb: 5 }}>
      <Grid container spacing={4}>
        
        {/* Left Side: Order Summary */}
        <Grid item xs={12} md={6}>
          <Box sx={{ backgroundColor: '#f9f9f9', p: 4, borderRadius: 2 }}>
            <Typography variant="h5" fontWeight="bold" mb={4}>
              Order Summary
            </Typography>

            <Box display="flex" justifyContent="space-between" mb={2}>
              <Typography>Greek Salad (x2)</Typography>
              <Typography>₹24.00</Typography>
            </Box>

            <Box display="flex" justifyContent="space-between" mb={2}>
              <Typography>Peri Peri Rolls (x3)</Typography>
              <Typography>₹36.00</Typography>
            </Box>

            <Box display="flex" justifyContent="space-between" mb={2}>
              <Typography>Delivery Charge</Typography>
              <Typography>₹160.00</Typography>
            </Box>

            <Divider sx={{ my: 3 }} />

            <Box display="flex" justifyContent="space-between">
              <Typography fontWeight="bold">Total</Typography>
              <Typography fontWeight="bold">₹220.00</Typography>
            </Box>
          </Box>
        </Grid>

        {/* Right Side: Payment Form */}
        <Grid item xs={12} md={6}>
          <Box sx={{ p: 4, borderRadius: 2, boxShadow: 3 }}>
            <Typography variant="h5" fontWeight="bold" mb={4}>
              Pay with Card
            </Typography>

            <Box component="form" noValidate autoComplete="off" display="flex" flexDirection="column" gap={3}>
              <TextField label="Email" fullWidth />
              <TextField label="Card Number" fullWidth />
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <TextField label="MM / YY" fullWidth />
                </Grid>
                <Grid item xs={6}>
                  <TextField label="CVC" fullWidth />
                </Grid>
              </Grid>
              <TextField label="Cardholder Name" fullWidth />
              <TextField label="Country / Region" fullWidth />
              
              <Button variant="contained" color="primary" size="large" sx={{ mt: 2 }}>
                Pay
              </Button>
            </Box>
          </Box>
        </Grid>

      </Grid>
    </Container>
  );
};

export default Payment;
