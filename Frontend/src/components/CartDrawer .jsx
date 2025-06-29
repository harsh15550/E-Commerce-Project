import {
  Drawer,
  Box,
  Typography,
  Divider,
  List,
  ListItem,
  Avatar,
  IconButton,
  Button,
  Paper,
  CircularProgress
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { useDispatch, useSelector } from 'react-redux';
import { setCartItems } from '../redux/cartSlice';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import axios from 'axios';


export default function CartDrawer({ drawerOpen, toggleDrawer }) {
  const { cartItems } = useSelector((state) => state.cartItems);
  const dispatch = useDispatch();
  const url = 'https://e-commerce-project-6wl4.onrender.com'
  const [loading, setLoading] = useState(false);
  const { user } = useSelector(store => store.user)

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

  const handleDeleteToCart = (product) => {
    let updatedCart = [];

    if (product.quantity >= 1) {

      updatedCart = cartItems.filter(item => item._id !== product._id);

      dispatch(setCartItems(updatedCart));
    };
  }

    const subtotal = cartItems?.length > 0 && cartItems?.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2);
    const deliveryCharge = 50; // Example fixed delivery fee
    const grandTotal = (parseFloat(subtotal) + deliveryCharge).toFixed(2);

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
        if (response.data.success) {
          window.location.href = response.data.url;
          setLoading(false);
        }
      } catch (error) {
        console.log(error);

      }

    }

    return (

      <Drawer anchor="right" open={drawerOpen} onClose={toggleDrawer(false)}>
        <Box
          sx={{
            width: 380,
            display: 'flex',
            flexDirection: 'column',
            height: '100%',
            bgcolor: '#fefefe',
          }}
        >
          {/* Header */}
          <Box
            sx={{
              p: 3,
              boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
              position: 'sticky',
              top: 0,
              bgcolor: '#ffffff',
              zIndex: 2,
            }}
          >
            <Typography variant="h6" fontWeight="bold">
              Your Cart
            </Typography>
          </Box>

          <Divider />

          {/* Item List */}
          <Box sx={{ flex: 1, overflowY: 'auto', p: 2 }}>
            <List disablePadding>
              {cartItems?.length > 0 && cartItems?.map((item) =>
              (
                <ListItem
                  key={item._id}
                  sx={{
                    mb: 2,
                    borderRadius: 3,
                    boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
                    bgcolor: '#fdfdfd',
                    transition: 'box-shadow 0.3s',
                    '&:hover': {
                      boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
                    },
                  }}
                  secondaryAction={
                    <IconButton onClick={() => handleDeleteToCart(item)} edge="end" color="error" sx={{ ml: 1 }}>
                      <DeleteIcon />
                    </IconButton>
                  }
                >
                  <Avatar
                    src={item?.productimgs[0]}
                    alt={item.name}
                    variant="rounded"
                    sx={{
                      width: 60,
                      height: 60,
                      mr: 2,
                      borderRadius: 2,
                      objectFit: 'cover',
                      objectPosition: 'top', // default hota hai — yahaan change karenge
                    }}
                  />


                  <Box sx={{ flex: 1 }}>
                    <Typography fontWeight="medium" fontSize={15}>
                      {item?.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      ₹{item?.price} x {item?.quantity}
                    </Typography>

                    {/* Quantity Controls */}
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                        mt: 1,
                        bgcolor: '#f0f0f0',
                        borderRadius: 2,
                        px: 1,
                        py: 0.5,
                        width: 'fit-content',
                      }}
                    >
                      <IconButton onClick={() => handleRemoveToCart(item)} size="small" color="primary" sx={{ p: 0.5 }}>
                        <RemoveIcon fontSize="small" />
                      </IconButton>
                      <Typography fontWeight="medium">{item.quantity}</Typography>
                      <IconButton onClick={() => handleAddToCart(item)} size="small" color="primary" sx={{ p: 0.5 }}>
                        <AddIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  </Box>
                </ListItem>
              ))}
            </List>
          </Box>

          <Divider />
          {/* Footer */}
          <Box
            sx={{
              p: 3,
              position: 'sticky',
              bottom: 0,
              bgcolor: '#ffffff',
              zIndex: 1,
            }}
          >
            <Box sx={{ pl: 2, borderRadius: 3, width: '300px' }}>
              {/* <Typography variant="h6" fontWeight="bold" gutterBottom>
              Cart Totals
            </Typography> */}
              {/* <Divider sx={{ mb: 3, mt: 3 }} /> */}
              <Box display="flex" justifyContent="space-between" my={1}>
                <Typography variant="body1">Subtotal</Typography>
                <Typography variant="body1">₹{subtotal}</Typography>
              </Box>
              <Box display="flex" justifyContent="space-between" my={1}>
                <Typography variant="body1">Delivery Fee</Typography>
                <Typography variant="body1">₹{deliveryCharge}</Typography>
              </Box>
              {/* <Divider sx={{ mb: 3, mt: 3 }} /> */}
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
                  mt: 3,
                  textTransform: 'none',
                  fontWeight: 'bold',
                  py: 1.5,
                  '&:hover': {
                    backgroundColor: '#e04b1f',
                  },
                }}
                disabled={cartItems.length === 0}
                onClick={handleSubmit}
              >
                {loading ? <CircularProgress size={24} color="inherit" /> : 'Proceed To Payment'}
              </Button>

            </Box>

          </Box>
        </Box>
      </Drawer>

    );
  }
