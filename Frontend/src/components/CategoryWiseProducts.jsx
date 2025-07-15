import { Box, Grid, Typography, IconButton, CircularProgress } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ProductCard from './ProductCard';
import axios, { all } from 'axios';
import { setAllProducts } from '../redux/productSlice';

const CategoryWiseProducts = () => {
    let url = "https://e-commerce-project-6wl4.onrender.com";
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(true);
    const { allProduct } = useSelector(store => store.products);
    const getAllProduct = async () => {
        try {
            const response = await axios.get(`${url}/api/product/getAllProduct`);
            if (response.data.success) {
                dispatch(setAllProducts(response.data.products));
                setLoading(false);
            }
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        getAllProduct();
    }, []);
    const [categories, setCategories] = useState({
        cloths: [],
        footwear: [],
        electronics: [],
        furniture: [],
        beauty: [],
        sports: [],
    });

    const [startIndexes, setStartIndexes] = useState({
        cloths: 0,
        footwear: 0,
        electronics: 0,
        furniture: 0,
        beauty: 0,
        sports: 0,
    });

    const visibleCount = 5; // Show 5 at a time

    useEffect(() => {
        const categoryWiseProducts = {
            cloths: allProduct.filter(item => item.mainCategory === 'Clothes'),
            footwear: allProduct.filter(item => item.mainCategory === 'Footwear'),
            electronics: allProduct.filter(item => item.mainCategory === 'Electronics'),
            furniture: allProduct.filter(item => item.mainCategory === 'Furniture'),
            beauty: allProduct.filter(item => item.mainCategory === 'Beauty'),
            sports: allProduct.filter(item => item.mainCategory === 'Sports'),
        };
        setCategories(categoryWiseProducts);
    }, [allProduct]);

    const handleScroll = (direction, category) => {
        const maxIndex = categories[category].length - visibleCount;
        setStartIndexes((prevIndexes) => {
            const newStartIndex = direction === "left"
                ? Math.max(0, prevIndexes[category] - visibleCount)
                : Math.min(maxIndex, prevIndexes[category] + visibleCount);
            return { ...prevIndexes, [category]: newStartIndex };
        });
    };

    const renderCategorySection = (category, categoryName) => {
        const maxIndex = categories[category].length - visibleCount;
        const visibleProducts = categories[category].slice(startIndexes[category], startIndexes[category] + visibleCount);

        return (
            categories[category].length > 0 && (
                <Box sx={{ mt: 4 }} key={category}>
                    {/* Heading and Arrows */}
                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            mb: 2,
                        }}
                    >
                        <Typography variant="h5">{categoryName}</Typography>
                        <Box>
                            <IconButton
                                onClick={() => handleScroll("left", category)}
                                disabled={startIndexes[category] === 0}
                                sx={{
                                    backgroundColor: "#fff",
                                    boxShadow: 1,
                                    mr: 1,
                                    ":hover": { backgroundColor: "#f0f0f0" },
                                }}
                            >
                                <ChevronLeftIcon />
                            </IconButton>
                            <IconButton
                                onClick={() => handleScroll("right", category)}
                                disabled={startIndexes[category] >= maxIndex}
                                sx={{
                                    backgroundColor: "#fff",
                                    boxShadow: 1,
                                    ":hover": { backgroundColor: "#f0f0f0" },
                                }}
                            >
                                <ChevronRightIcon />
                            </IconButton>
                        </Box>
                    </Box>

                    {/* Show Only 5 Products */}
                    <Box sx={{ display: "flex", gap: 2.9 }}>
                        {visibleProducts.map((item, index) => (
                            <Box key={index} sx={{ width: "240px" }}>
                                <ProductCard item={item} />
                            </Box>
                        ))}
                    </Box>
                </Box>
            )
        );
    };

    if (loading) {
        return <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            height="70vh"
            width="100%"
        >
            <CircularProgress size={60} />
        </Box>;
    }

    return (
        <Box>
            <Box sx={{ display: 'flex' }}>
                <Grid container spacing={3} mt={2} justifyContent="flex-start" alignItems="flex-start">
                    {renderCategorySection('footwear', 'Footwear')}
                    {renderCategorySection('cloths', 'Men and Women Clothes')}
                    {renderCategorySection('furniture', 'Furniture')}
                    {renderCategorySection('electronics', 'Electronics')}
                    {renderCategorySection('beauty', 'Beauty')}
                    {renderCategorySection('sports', 'Sports')}
                </Grid>
            </Box>
        </Box>
    );
}

export default CategoryWiseProducts;
