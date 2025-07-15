import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
    Typography, Avatar, Chip, Box, IconButton, Dialog, DialogTitle,
    DialogContent, TextField, DialogActions, Button, Rating,
    CircularProgress
} from '@mui/material';
import axios from 'axios';
import RateReviewIcon from '@mui/icons-material/RateReview';
import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';
import { setCartItems } from '../redux/cartSlice';

const MyOrders = () => {
    const url = 'https://e-commerce-project-6wl4.onrender.com';
    const [orders, setOrders] = useState([]);
    const [selectedOrder, setSelectedOrder] = useState({});
    const [review, setReview] = useState({});
    const [openDialog, setOpenDialog] = useState(false);
    const [comment, setComment] = useState('');
    const [rating, setRating] = useState(0);
    const [loading, setLoading] = useState(true);
    const dispatch = useDispatch();

    const location = useLocation();

    useEffect(() => {
        const sessionId = new URLSearchParams(location.search).get("session_id");

        if (sessionId) {
            dispatch(setCartItems([]));

            // ✅ Optional: Remove session_id from URL (optional clean-up)
            window.history.replaceState({}, document.title, "/myOrders");
        }
    }, [location.search]);

    useEffect(() => {
        handleBuyerOrders();
    }, []);

    useEffect(() => {
        setComment(review.comment || '');
        setRating(review.rating || 0);
    }, [review]);

    const handleBuyerOrders = async () => {
        try {
            const response = await axios.get(`${url}/api/order/buyerOrder`, { withCredentials: true });
            if (response.data.success) {
                setOrders(response.data.orders);
                setLoading(false);
            }
        } catch (error) {
            console.log(error);
        }
    };

    const handleReviewClick = async (order) => {
        setSelectedOrder(order);
        setOpenDialog(true);
        setReview({});
        setComment('');
        setRating(0);

        try {
            const productId = order?.products?.[0]?.productId?._id;
            if (!productId) {
                toast.error("Product ID not found!");
                return;
            }

            const response = await axios.get(`${url}/api/product/getReview/${productId}`, { withCredentials: true });
            if (response.data.success) {
                setReview(response?.data?.review || {});
            }
        } catch (error) {
            console.log(error);
        }
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setComment('');
        setRating(0);
    };

    const handleSubmitReview = async (productId) => {
        try {
            const response = await axios.post(`${url}/api/product/addReview/${productId}`, { comment, rating }, { withCredentials: true });
            if (response.data.success) {
                toast.success(response.data.message);
                handleCloseDialog();
            }
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <Box sx={{ p: 4, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <Typography variant="h4" gutterBottom sx={{ mb: 3, fontWeight: 600, color: 'primary.main' }}>
                My Orders
            </Typography>

            {loading ? (
                <Box
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    height="70vh"
                    width="100%"
                >
                    <CircularProgress size={60} />
                </Box>
            ) : (
                <TableContainer component={Paper} sx={{ width: '90%', boxShadow: 2, borderRadius: 2 }}>
                    <Table sx={{ minWidth: 700 }}>
                        <TableHead sx={{ backgroundColor: 'background.paper' }}>
                            <TableRow>
                                <TableCell align="center" sx={{ fontWeight: 'bold' }}>Product Image</TableCell>
                                <TableCell align="center" sx={{ fontWeight: 'bold' }}>Product Name</TableCell>
                                <TableCell align="center" sx={{ fontWeight: 'bold' }}>Price</TableCell>
                                <TableCell align="center" sx={{ fontWeight: 'bold' }}>Size</TableCell>
                                <TableCell align="center" sx={{ fontWeight: 'bold' }}>Quantity</TableCell>
                                <TableCell align="center" sx={{ fontWeight: 'bold' }}>Total</TableCell>
                                <TableCell align="center" sx={{ fontWeight: 'bold' }}>Payment Status</TableCell>
                                <TableCell align="center" sx={{ fontWeight: 'bold' }}>Delivery Status</TableCell>
                                <TableCell align="center" sx={{ fontWeight: 'bold' }}>Review</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {orders.map((order) => (
                                <TableRow key={order._id} sx={{ '&:nth-of-type(odd)': { backgroundColor: 'grey.100' } }}>
                                    <TableCell align="center">
                                        <img src={order.products[0].image} alt={order.products[0].productId.name} style={{ width: 60, ml: 5, height: 70, objectFit: 'cover', borderRadius: '8px' }} />
                                    </TableCell>
                                    <TableCell align="center">{order.products[0].productId.name}</TableCell>
                                    <TableCell align="center">₹{order.products[0].price}</TableCell>
                                    <TableCell align="center">{order.products[0].productSize}</TableCell>
                                    <TableCell align="center">{order.products[0].quantity}</TableCell>
                                    <TableCell align="center">₹{order.totalAmount}</TableCell>
                                    <TableCell align="center">
                                        <Chip
                                            label={order.paymentStatus}
                                            color={order.paymentStatus === 'Paid' ? 'success' : 'warning'}
                                            variant="outlined"
                                            sx={{ fontWeight: 'bold', color: 'text.primary' }}
                                        />
                                    </TableCell>
                                    <TableCell align="center">
                                        <Chip
                                            label={order.orderStatus}
                                            color={order.orderStatus === 'Delivered' ? 'success' : 'info'}
                                            variant="outlined"
                                            sx={{ fontWeight: 'bold', color: 'text.primary' }}
                                        />
                                    </TableCell>
                                    <TableCell align="center">
                                        <IconButton sx={{ color: "blue" }} onClick={() => handleReviewClick(order)}>
                                            <RateReviewIcon sx={{ fontSize: 30 }} />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}

            {/* Review Dialog */}
            <Dialog
                open={openDialog}
                onClose={handleCloseDialog}
                maxWidth="xs"
                fullWidth
                sx={{ '& .MuiDialog-paper': { borderRadius: 4, p: 2 } }}
            >
                <DialogTitle sx={{ fontWeight: 'bold', textAlign: 'center', fontSize: '1.5rem' }}>
                    Write a Review
                </DialogTitle>

                <DialogContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                    <Rating
                        name="rating"
                        value={rating}
                        size="large"
                        onChange={(event, newValue) => setRating(newValue)}
                    />
                    <TextField
                        label="Your Review"
                        multiline
                        rows={4}
                        fullWidth
                        variant="outlined"
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                    />
                </DialogContent>

                <DialogActions sx={{ justifyContent: 'center', mb: 2 }}>
                    <Button onClick={handleCloseDialog} variant="outlined" color="error" sx={{ px: 4 }}>
                        Cancel
                    </Button>
                    <Button
                        onClick={() => handleSubmitReview(selectedOrder?.products?.[0]?.productId?._id)}
                        variant="contained"
                        color="primary"
                        sx={{ px: 4 }}
                    >
                        Submit
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default MyOrders;
