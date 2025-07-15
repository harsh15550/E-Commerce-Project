import React, { useState } from 'react';
import {
    Box,
    Button,
    IconButton,
    MenuItem,
    TextField,
    Typography,
    CircularProgress,
    FormControl,
    InputLabel,
    Select,
    Paper
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const AddProduct = () => {
    const url = 'https://e-commerce-project-6wl4.onrender.com';

    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [selectedSizes, setSelectedSizes] = useState([]);
    const [mainCategory, setMainCategory] = useState('');
    const [subCategory, setSubCategory] = useState('');
    const [stock, setStock] = useState('');
    const [price, setPrice] = useState('');
    const [discount, setDiscount] = useState('');
    const [productimgs, setProductImgs] = useState([]);
    const [loading, setLoading] = useState(false);

    const sizeOptions = {
        Clothes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
        Footwear: ['IND-6', 'IND-7', 'IND-8', 'IND-9', 'IND-10'],
    };

    const categories = {
        Clothes: ['Men', 'Women', 'Kids', 'Winterwear'],
        Footwear: ['Boots', 'Sneakers', 'Sandals', 'Formal Shoes', 'Sports Shoes', 'Slippers'],
        Electronics: ['TV', 'Washing Machine', 'Refrigerator', 'Laptop', 'Mobile'],
        Furniture: ['Sofa', 'Bed', 'Chair', 'Table'],
        Beauty: ['Skincare', 'Haircare', 'Makeup'],
        Sports: ['Cricket', 'Football', 'Gym Equipment'],
    };

    const navigate = useNavigate();

    const toggleSize = (size) => {
        setSelectedSizes((prev) =>
            prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]
        );
    };

    const handleMainCategoryChange = (e) => {
        setMainCategory(e.target.value);
        setSubCategory('');
        setSelectedSizes([]); // Category change pe selected size reset kar do
    };

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        setProductImgs((prevImgs) => [...prevImgs, ...files]);
    };

    const removeImage = (index) => {
        setProductImgs((prev) => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = async () => {
        if((mainCategory === 'Clothes' && selectedSizes.length === 0 ) || (mainCategory === 'Footwear' && selectedSizes.length === 0)  ){
            toast.error('Please Select Size');
            return;
        }
        if (!name || !description || !mainCategory || !subCategory || !price || productimgs.length === 0 ) {
            toast.error('Please Fill All Fields');
            return;
        }
        setLoading(true);
        try {
            const formData = new FormData();
            formData.append('name', name);
            formData.append('description', description);
            formData.append('mainCategory', mainCategory);
            formData.append('subCategory', subCategory);
            formData.append('price', price);
            formData.append('stock', stock);
            formData.append('discount', discount);

            productimgs.forEach((img) => {
                formData.append('productimgs', img);
            });

            selectedSizes.forEach((size) => {
                formData.append('sizes', size);
            });

            const response = await axios.post(`${url}/api/product/addproduct`, formData, { withCredentials: true });

            if (response.data.success) {
                toast.success(response.data.message);
                navigate('/dashboard/products');
            }
        } catch (error) {
            console.error(error);
            toast.error('Something went wrong!');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Paper elevation={3} sx={{ p: 4, maxWidth: 1100, boxShadow: 'none', borderRadius: 4 }}>
            <Typography variant="h5" fontWeight="bold" mb={3}>
                Add New Product
            </Typography>

            <Box display="flex" flexWrap="wrap" gap={4}>
                {/* Left Side */}
                <Box flex={1} minWidth="300px">
                    <TextField
                        fullWidth
                        label="Product Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        sx={{ mb: 2 }}
                        size="small"
                        required
                    />

                    <TextField
                        fullWidth
                        multiline
                        rows={4}
                        label="Description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        sx={{ mb: 2 }}
                        size="small"
                        required
                    />

                    <FormControl fullWidth sx={{ mb: 2 }} required>
                        <InputLabel>Main Category</InputLabel>
                        <Select value={mainCategory} onChange={handleMainCategoryChange} label="Main Category">
                            {Object.keys(categories).map((cat) => (
                                <MenuItem key={cat} value={cat}>{cat}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    {mainCategory && (
                        <FormControl fullWidth sx={{ mb: 2 }} required>
                            <InputLabel>Subcategory</InputLabel>
                            <Select
                                value={subCategory}
                                onChange={(e) => setSubCategory(e.target.value)}
                                label="Subcategory"
                            >
                                {categories[mainCategory].map((sub, i) => (
                                    <MenuItem key={i} value={sub}>{sub}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    )}

                    {subCategory && (
                        <Typography variant="body2" mt={1} mb={2}>
                            Selected: <strong>{mainCategory} → {subCategory}</strong>
                        </Typography>
                    )}

                    {sizeOptions[mainCategory] && (
                        <>
                            <Typography fontWeight="bold" mb={1}>
                                Sizes:
                            </Typography>
                            <Box display="flex" gap={1} flexWrap="wrap" mb={2}>
                                {sizeOptions[mainCategory].map((size) => (
                                    <Button
                                        key={size}
                                        variant={selectedSizes.includes(size) ? 'contained' : 'outlined'}
                                        color={selectedSizes.includes(size) ? 'primary' : 'inherit'}
                                        onClick={() => toggleSize(size)}
                                        size="small"
                                        sx={{
                                            minWidth: 42,
                                            px: 1,
                                            fontWeight: 500,
                                            borderRadius: 2,
                                        }}
                                    >
                                        {size}
                                    </Button>
                                ))}
                            </Box>
                        </>
                    )}

                    <Box display="flex" gap={2} mb={2}>
                        <TextField
                            fullWidth
                            label="Price"
                            type="number"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                            size="small"
                            required
                        />
                    <TextField
                        fullWidth
                        label="Discount"
                        type="number"
                        value={discount}
                        onChange={(e) => setDiscount(e.target.value)}
                        size="small"
                        sx={{ mb: 2 }}
                    />
                    </Box>
                        <TextField
                            fullWidth
                            label="Stock"
                            type="number"
                            value={stock}
                            onChange={(e) => setStock(e.target.value)}
                            size="small"
                            required
                        />



                </Box>

                {/* Right Side - Image Upload */}
                <Box flex={1} minWidth="280px">
                    <Typography fontWeight="bold" mb={1}>
                        Upload Product Images
                    </Typography>
                    <Button variant="outlined" component="label" fullWidth sx={{ mb: 2 }}>
                        Choose Files
                        <input type="file" hidden multiple onChange={handleImageChange} />
                    </Button>

                    <Box display="flex" flexWrap="wrap" gap={2}>
                        {productimgs.map((img, i) => (
                            <Box key={i} position="relative" width={100} height={100}>
                                <Box
                                    width={100}
                                    height={100}
                                    borderRadius="50%"
                                    overflow="hidden"
                                    border="2px solid #eee"
                                >
                                    <img
                                        src={URL.createObjectURL(img)}
                                        alt={`img-${i}`}
                                        width="100%"
                                        height="100%"
                                        style={{ objectFit: 'cover' }}
                                    />
                                </Box>
                                <IconButton
                                    onClick={() => removeImage(i)}
                                    size="small"
                                    sx={{
                                        position: 'absolute',
                                        top: -8,
                                        right: -8,
                                        bgcolor: '#fff',
                                        border: '1px solid #ccc',
                                        zIndex: 1,
                                        '&:hover': { bgcolor: '#eee' }
                                    }}
                                >
                                    <CloseIcon fontSize="small" />
                                </IconButton>
                            </Box>
                        ))}
                    </Box>
                </Box>
            </Box>

            <Box mt={4} textAlign="center">
                <Button
                    variant="contained"
                    color="primary"
                    size="large"
                    onClick={handleSubmit}
                    disabled={loading}
                    sx={{ px: 5, borderRadius: 3 }}
                >
                    {loading ? <CircularProgress size={20} color="inherit" /> : 'Submit Product'}
                </Button>
            </Box>
        </Paper>
    );
};

export default AddProduct;
