import React, { useEffect, useState } from 'react';
import { Box, Typography, Grid } from '@mui/material';
import CheckroomIcon from '@mui/icons-material/Checkroom';
import DevicesIcon from '@mui/icons-material/Devices';
import SpaIcon from '@mui/icons-material/Spa';
import categoty1 from '../assets/category1.avif'
import categoty2 from '../assets/category2.avif'
import categoty3 from '../assets/category3.avif'
import { useSelector } from 'react-redux';
import ProductCard from './ProductCard';

const categories = [
    {
        name: 'Fashion',
        icon: <CheckroomIcon sx={{ fontSize: 40, color: '#fff' }} />,
        image: categoty1,
        category: 'Clothes'
    },
    {
        name: 'Electronics',
        icon: <DevicesIcon sx={{ fontSize: 40, color: '#fff' }} />,
        image: categoty2,
        category: 'Electronics'
    },
    {
        name: 'Beauty',
        icon: <SpaIcon sx={{ fontSize: 40, color: '#fff' }} />,
        image: categoty3,
        category: 'Beauty'
    },
];

const Categories = () => {
    const { allProduct } = useSelector(store => store.products);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [products, setProducts] = useState([]);

    useEffect(() => {
        const filtered = allProduct.filter((pro) => pro.mainCategory === selectedCategory);
        setProducts(filtered);
    }, [selectedCategory, allProduct]);


    return (
        <Box sx={{ pt: 3 }} >
            <Typography variant="h4" align="center" mb={4}>
                Explore Our Top Categories
            </Typography>

            <Grid
                container
                spacing={4}
                sx={{
                    display: 'flex',
                    // justifyContent: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                }}

            >
                {categories.map((cat, index) => (
                    <Grid
                        key={index}
                        sx={{
                            display: 'flex',
                            justifyContent: 'center',
                            width: '100%',
                            maxWidth: '410px',
                            // flex: '0 1 410px',
                            cursor: 'pointer'
                        }}
                        onClick={() => setSelectedCategory(cat.category)}

                    >
                        <Box
                            sx={{
                                width: '100%',
                                height: '250px',
                                backgroundImage: `url(${cat.image})`,
                                backgroundSize: 'cover',
                                backgroundPosition: 'center',
                                borderRadius: 2,
                                overflow: 'hidden',
                                position: 'relative',
                                transition: 'transform 0.3s ease',
                            }}
                        >
                            <Box
                                sx={{
                                    position: 'absolute',
                                    width: '100%',
                                    height: '100%',
                                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    color: '#fff',
                                }}
                            >
                                {cat.icon}
                                <Typography variant="h5" fontWeight="bold">
                                    {cat.name}
                                </Typography>
                            </Box>
                        </Box>
                    </Grid>
                ))}
            </Grid>

            <Box sx={{ display: 'flex' }}>
                <Grid
                    container
                    spacing={3}
                    mt={6}
                    justifyContent="flex-start"
                    alignItems="flex-start"
                >
                    {selectedCategory ? (

                        products.length > 0 ? (products?.map((item, index) => (
                            <Grid key={index}>
                                <ProductCard item={item} />
                            </Grid>
                        ))) : (<Typography variant={'h4'} >No products uploaded in this category.</Typography>)
                    ) : null
                    }
                </Grid>
            </Box>

        </Box>
    );
};

export default Categories;
