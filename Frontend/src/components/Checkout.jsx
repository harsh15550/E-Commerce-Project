import React, { useState } from 'react';
import { Box, Grid, Typography, IconButton, Button, Paper, Divider, CircularProgress } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { useDispatch, useSelector } from 'react-redux';
import { setCartItems } from '../redux/cartSlice';
import axios from 'axios';

export default function CheckoutPage() {
  const { cartItems } = useSelector((state) => state.cartItems);
  const {user} = useSelector(store => store.user)
  console.log(user);
  
  const dispatch = useDispatch();
  const url = 'http://localhost:3000'
  const [loading, setLoading] = useState(false);
  const handleAddToCart = (product) => {
    const existingItem = cartItems?.find(item => item._id === product._id);

    const updatedCart = existingItem
      ? cartItems.map(item =>
        item._id === product._id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      )
      : [...cartItems, { ...product, quantity: 1 }];

    dispatch(setCartItems(updatedCart));
  };

  const handleRemoveToCart = (product) => {
    let updatedCart = [];

    if (product.quantity > 1) {
      updatedCart = cartItems.map(item =>
        item._id === product._id
          ? { ...item, quantity: item.quantity - 1 }
          : item
      );
    } else {
      updatedCart = cartItems.filter(item => item._id !== product._id);
    }

    dispatch(setCartItems(updatedCart));
  };

  const handleSubmit = async () => {
    setLoading(true)
    try {
     
      const response = await axios.post(
        `${url}/api/payment/create-payment-intent`,
        {
          cartItems,
          buyerId: user._id
        },
        { withCredentials: true }
      );
  
      console.log(response);
      if(response.data.success){
        window.location.href = response.data.url;
        setLoading(false);
      }
    } catch (error) {
      console.log(error);
  
    }
  
  }

  const subtotal = cartItems?.length > 0 && cartItems?.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2);
  const deliveryCharge = 50; // Example fixed delivery fee
  const grandTotal = (parseFloat(subtotal) + deliveryCharge).toFixed(2);

  return (
    <Grid container spacing={4} sx={{ p: 4 }}>
  {/* Cart Items Section */}
  <Grid item xs={12} md={8}>
    <Paper elevation={1} sx={{ p: 3, borderRadius: 3 }}>
      <Typography variant="h5" fontWeight="bold" gutterBottom>
        Your Cart
      </Typography>
      <Divider sx={{ mb: 3 }} />
      <Box>
        {cartItems?.length > 0 ? (
          cartItems.map((item) => (
            <Box
              key={item._id}
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                mb: 2,
                p: 2,
                gap:15,
                borderRadius: 2,
                border: '1px solid #eee',
                transition: '0.3s',
                '&:hover': {
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                  borderColor: 'transparent',
                },
              }}
            >
              {/* Image */}
              <Box sx={{ flexShrink: 0 }}>
                <img
                  src={item?.productimgs[0]}
                  alt={item.name}
                  style={{
                    width: 70,
                    height: 70,
                    borderRadius: 8,
                    objectFit: 'cover',
                    objectPosition: 'center',
                  }}
                />
              </Box>

              {/* Name and Price */}
              <Box sx={{ flexGrow: 1, ml: 3 }}>
                <Typography variant="subtitle1" fontWeight="600">
                  {item?.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  ₹{item?.price}
                </Typography>
              </Box>

              {/* Quantity Controls */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mr: 2 }}>
                <IconButton onClick={() => handleRemoveToCart(item)} size="small" color="primary">
                  <RemoveIcon fontSize="small" />
                </IconButton>
                <Typography fontWeight="bold">{item.quantity}</Typography>
                <IconButton onClick={() => handleAddToCart(item)} size="small" color="primary">
                  <AddIcon fontSize="small" />
                </IconButton>
              </Box>

              {/* Delete Button */}
              <IconButton color="error" onClick={() => handleRemoveToCart(item)}>
                <DeleteIcon />
              </IconButton>
            </Box>
          ))
        ) : (
          <Typography variant="body1" color="text.secondary">
            Your cart is empty.
          </Typography>
        )}
      </Box>
    </Paper>
  </Grid>

  {/* Cart Totals Section */}
  <Grid item xs={12} md={4}>
    <Paper elevation={1} sx={{ p: 3, borderRadius: 3, width:'300px' }}>
      <Typography variant="h5" fontWeight="bold" gutterBottom>
        Cart Totals
      </Typography>
      <Divider sx={{ mb: 3, mt:3 }} />
      <Box display="flex" justifyContent="space-between" my={2}>
        <Typography variant="body1">Subtotal</Typography>
        <Typography variant="body1">₹{subtotal}</Typography>
      </Box>
      <Box display="flex" justifyContent="space-between" my={2}>
        <Typography variant="body1">Delivery Fee</Typography>
        <Typography variant="body1">₹{deliveryCharge}</Typography>
      </Box>
      <Divider sx={{ mb: 3, mt:3 }} />
      <Box display="flex" justifyContent="space-between">
        <Typography variant="h6" fontWeight="bold">
          Total
        </Typography>
        <Typography variant="h6" fontWeight="bold">
          ₹{grandTotal}
        </Typography>
      </Box>

      <Button
              variant="contained"
              fullWidth
              sx={{
                backgroundColor: '#f25c29',
                color: 'white',
                mt:3,
                textTransform: 'none',
                fontWeight: 'bold',
                py: 1.5,
                '&:hover': {
                  backgroundColor: '#e04b1f',
                },
              }}
              onClick={handleSubmit}
            >
      {loading ? <CircularProgress size={24} color="white" /> : 'Proceed To Payment'}
      </Button>
    </Paper>
  </Grid>
</Grid>

  );
}



