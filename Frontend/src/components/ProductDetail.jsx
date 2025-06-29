import React, { useEffect, useState } from 'react';
import {
    Box,
    Grid,
    Typography,
    Button,
    Rating,
    Card,
    CardContent,
    Avatar,
    Drawer,
    List,
    ListItem,
    ListItemText,
    IconButton,
    TextField,
    Divider,
} from '@mui/material';
import { Link, useParams } from 'react-router-dom';
import CircularProgress from '@mui/material/CircularProgress';
import { useDispatch, useSelector } from 'react-redux';
import { setCartItems } from '../redux/cartSlice';
import { toast } from 'react-toastify';
import ProductCard from './ProductCard';
import axios from 'axios';
import StarIcon from '@mui/icons-material/Star';
import ChatApp from './ChatApp';

const ProductDetail = () => {
    const [product, setProduct] = useState(null);
    const [selectedSize, setSelectedSize] = useState('');
    const { id } = useParams();
    const { allProduct } = useSelector((state) => state.products);
    const [loading, setLoading] = useState(true); // initially loading true
    const [mainImg, setMainimg] = useState();
    const { user } = useSelector(store => store.user);
    const dispatch = useDispatch();
    const { cartItems } = useSelector((state) => state.cartItems);
    const [quantity, setQuantity] = useState(0);
    const [reletedProducts, setReletedProducts] = useState([]);
    const url = 'https://e-commerce-project-6wl4.onrender.com';

    const [open, setOpen] = useState(false);

    console.log(product);

    const toggleDrawer = (state) => () => {
        setOpen(state);
    };

    // Fetch product details
    const handleProductDetail = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${url}/api/product/productDetail/${id}`, { withCredentials: true });
            if (response.data.success) {
                setProduct(response.data.product);  // Set the product data
                setLoading(false);
            }
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        if (id) handleProductDetail();
    }, [id]);

    useEffect(() => {
        if (product) {
            setMainimg(product?.productimgs[0]);
        }
    }, [product]);

    useEffect(() => {
        if (product) {
            const filtered = allProduct.filter((pro) => pro.subCategory === product.subCategory);
            setReletedProducts(filtered);
        }
    }, [product, allProduct]);

    const handleAddToCart = (product, selectedSize) => {
        if (!quantity) {
            toast.error('Quantity must be at least 1.');
            return;
        }
        if ((product.mainCategory === 'Clothes' && !selectedSize) || (product.mainCategory === 'Footwear' && !selectedSize)) {
            toast.error('Please select a size');
            return;
        }

        const existingItem = cartItems.find(item => item._id === product._id);
        const updatedCart = existingItem
            ? cartItems.map(item =>
                item._id === product._id
                    ? { ...item, quantity, productSize: selectedSize, price: Math.round(product?.price - (product?.price * product?.discount) / 100) }
                    : item
            )
            : [...cartItems, { ...product, quantity, productSize: selectedSize, price: Math.round(product?.price - (product?.price * product?.discount) / 100) }
            ];

        dispatch(setCartItems(updatedCart));
        toast.success('Item Added');
    };

    // 1. Original Average
    let originalAverage = product?.reviews?.reduce((acc, review) => acc + review?.rating, 0) / product?.reviews?.length;

    // 2. Display ke liye: 2 decimal tak original value
    const displayStarValue = Number(originalAverage.toFixed(2));

    // 3. Stars ke liye: nearest 0.5 rounding
    const starValue = Math.round(originalAverage * 2) / 2;


    useEffect(() => {
        const existingItem = cartItems.length > 0 && cartItems.find(item => item._id === product?._id);
        if (existingItem) {
            setQuantity(existingItem.quantity);
        } else {
            setQuantity(0); // default starting quantity
        }
    }, [cartItems, product?._id]);

    return (
        <Box>
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
                //   <></>
                <Box p={4} ml={'80px'}>
                    <Grid sx={{ display: 'flex' }} mt={2} container spacing={4}>
                        {/* Left Side */}
                        <Grid
                            sx={{
                                display: 'flex',
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                                gap: '15px'
                            }}
                        >
                            <Box sx={{ display: 'flex', maxHeight: '480px', overflowY: 'scroll', scrollbarWidth: 'none', flexDirection: 'column' }}>
                                {product?.productimgs?.map((img, idx) => (
                                    <Grid key={idx}>
                                        <img
                                            src={img}
                                            onClick={() => setMainimg(img)}
                                            style={{
                                                width: '90px',
                                                height: '103px',
                                                cursor: 'pointer',
                                                borderRadius: '5px',
                                                objectFit: 'cover',
                                                marginBottom: '10px',
                                                border: img === mainImg ? '2px solid black' : '0.1px solid gray',
                                            }}
                                        />
                                    </Grid>
                                ))}
                            </Box>
                            <Box mb={2}>
                                <img src={mainImg} style={{ width: '450px', borderRadius: '10px', border: '1px solid gray', height: '500px', objectFit: 'contain' }} />
                            </Box>
                        </Grid>

                        {/* Right Side */}
                        <Grid sx={{ maxWidth: '700px' }}>
                            {/* Brand Name */}
                            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>

                                <Typography variant="h4" fontWeight="bold" gutterBottom sx={{ color: '#333' }}>
                                    {product?.name}
                                </Typography>
                            </Box>

                            {/* Rating */}
                            <Box display="flex" alignItems="center" gap={1} mb={2}>
                                <Rating value={starValue} precision={0.5} readOnly />

                                {/* Rating Value and Star Icon Together */}
                                <Box display="flex" border={'1px solid black'} color={"text.secondary"} borderRadius={2} p={1} pt={0.1} pb={0.1} alignItems="center">
                                    <Typography
                                        variant="body2"
                                        sx={{
                                            fontWeight: 700,
                                            color: "text.primary",
                                            fontSize: "20px",
                                            letterSpacing: "0.3px",
                                        }}
                                    >
                                        {displayStarValue}
                                    </Typography>
                                    <StarIcon style={{ fontSize: "22px" }} />
                                </Box>

                                {/* Ratings count */}
                                <Typography
                                    variant="body2"
                                    sx={{
                                        fontWeight: 500,
                                        color: "text.secondary",
                                        fontSize: "25px",
                                        marginLeft: "4px",
                                    }}
                                >
                                    ({product?.reviews?.length} ratings)
                                </Typography>
                            </Box>


                            {/* Price */}
                            <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 2, mb: 2 }}>
                                {/* Final Price after discount */}
                                <Typography
                                    variant="h5"
                                    fontWeight="bold"
                                    color="primary"
                                >
                                    ₹{Math.round(product?.price - (product?.price * product?.discount) / 100)}
                                </Typography>

                                {/* Original Price */}
                                <Typography
                                    variant="h6"
                                    fontWeight="medium"
                                    color="text.secondary"
                                    sx={{ textDecoration: 'line-through' }}
                                >
                                    ₹{product?.price}
                                </Typography>

                                {/* Discount Percentage */}
                                <Typography
                                    variant="body2"
                                    sx={{ color: 'green', fontWeight: 'bold' }}
                                >
                                    {product?.discount}% OFF
                                </Typography>
                            </Box>

                            {/* Size Buttons */}
                            <Typography variant="subtitle1" fontWeight="medium" sx={{ mb: 1 }}>
                                Select Size
                            </Typography>
                            <Box display="flex" gap={1} flexWrap="wrap" mb={3}>
                                {product?.sizes.map((size) => (
                                    <Button
                                        key={size}
                                        onClick={() => {
                                            setSelectedSize(size);
                                        }}
                                        sx={{
                                            minWidth: 60,
                                            bgcolor: selectedSize === size ? '#2196f3' : '#DCDCDC',
                                            color: selectedSize === size ? 'white' : 'black',
                                            outline: 'none',
                                            borderRadius: 2,
                                            fontWeight: 'bold',
                                            textTransform: 'none'
                                        }}
                                    >
                                        {size}
                                    </Button>
                                ))}
                            </Box>

                            {/* Add to Cart Button */}
                            <Box display="flex" alignItems="center" gap={2} mb={3}>
                                <Box display="flex" alignItems="center" border="1px solid #ccc" borderRadius={2} px={1}>
                                    <Button
                                        onClick={() => {
                                            setQuantity(prev => Math.max(0, prev - 1));

                                            const existingItem = cartItems.find(item => item._id === product._id);
                                            if (existingItem) {
                                                const updatedCart = cartItems.map(item =>
                                                    item._id === product._id
                                                        ? { ...item, quantity: Math.max(0, item.quantity - 1) }
                                                        : item
                                                );
                                                dispatch(setCartItems(updatedCart));
                                            }
                                        }}
                                        sx={{ minWidth: 36, color: 'black' }}
                                    >
                                        –
                                    </Button>

                                    <Typography sx={{ mx: 2 }}>
                                        {quantity}
                                    </Typography>

                                    <Button
                                        onClick={() => {
                                            setQuantity(prev => prev + 1);

                                            const existingItem = cartItems.find(item => item._id === product._id);
                                            if (existingItem) {
                                                const updatedCart = cartItems.map(item =>
                                                    item._id === product._id
                                                        ? { ...item, quantity: item.quantity + 1 }
                                                        : item
                                                );
                                                dispatch(setCartItems(updatedCart));
                                            }
                                        }}
                                        sx={{ minWidth: 36, color: 'black' }}
                                    >
                                        +
                                    </Button>

                                </Box>

                                <Button
                                    variant="contained"
                                    size="large"
                                    sx={{
                                        borderRadius: 2,
                                        py: 1,
                                        px: 4,
                                        color: 'white',
                                        bgcolor: 'black',
                                        fontWeight: 'bold',
                                        textTransform: 'none',
                                        fontSize: '16px',
                                    }}
                                    onClick={() => handleAddToCart(product, selectedSize)}
                                >
                                    Add to Cart
                                </Button>
                                {user._id !== product?.sellerId &&
                                    <Button variant="outlined" sx={{ py: 1, px: 2 }} onClick={toggleDrawer(true)} >Chat With seller</Button>
                                }

                            </Box>

                            {/* Description */}
                            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                                {product?.description}
                            </Typography>
                        </Grid>
                    </Grid>

                    <Typography variant='h5'>Related Products</Typography>

                    <Box sx={{ display: 'flex' }}>
                        <Grid
                            container
                            spacing={3}
                            mt={3}
                            justifyContent="flex-start"
                            alignItems="flex-start"
                        >
                            {reletedProducts.filter(p => p._id !== product?._id).length > 0 ? (
                                reletedProducts
                                    .filter(p => p._id !== product?._id)
                                    .slice(0, 5)
                                    .map((item, index) => (
                                        // <Link style={{ textDecoration: 'none' }} to={`/productDetail/${item._id}`} key={index}>
                                        <Grid key={index}>
                                            <ProductCard item={item} />
                                        </Grid>
                                        // </Link>
                                    ))
                            ) : (
                                <Typography variant={'h4'}>No related products found in this category.</Typography>
                            )}
                        </Grid>
                    </Box>

                    <Typography sx={{ mt: 3, mb: 3 }} variant='h5' fontWeight={'bold'}>Customer Reviews</Typography>

                    <Grid container spacing={4}>
                        {product?.reviews?.map((review, index) => (
                            <Grid key={index}>
                                <Card sx={{ p: 3, width: '350px', borderRadius: 3, border: '1px solid grey', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
                                    <CardContent>
                                        <Box display="flex" alignItems="center" mb={2}>
                                            <Avatar sx={{ mr: 2 }}>{review?.userId?.firstName[0]}</Avatar>
                                            <Box>
                                                <Typography fontWeight="bold">{review?.userId?.firstName} {review?.userId?.lastName}</Typography>
                                                <Rating value={review.rating} readOnly size="small" />
                                            </Box>
                                        </Box>
                                        <Typography color="text.secondary">{review.comment}</Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>

                    {/* Chat Section  */}

                    <Drawer anchor="right" open={open} onClose={toggleDrawer(false)}>
                        <Box sx={{ width: 400, height: "95%", display: "flex", flexDirection: "column", p: 2 }}>
                            <Typography variant="h6" gutterBottom>
                                Chat with Seller
                            </Typography>
                            <Divider sx={{ mb: 1 }} />

                            <Box sx={{ flexGrow: 1, minHeight: 0 }}>
                                <ChatApp sellerId={product?.sellerId} />
                            </Box>
                        </Box>
                    </Drawer>

                </Box>
                    )
                }
                    </Box>

)
}



export default ProductDetail;
