import { Box, Grid, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ProductCard from './ProductCard';

const Favorites = () => {
  const url = 'http://localhost:3000';
  const [favorite, setFavorite] = useState([]);

  const getFavoriteProduct = async () => {
    try {
      const response = await axios.get(`${url}/api/user/getfavorite`, { withCredentials: true });
      if (response.data.success) {
        setFavorite(response.data.favourite);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getFavoriteProduct();
  }, []);

  return (
    <Box sx={{ px: { xs: 2, sm: 4, md: 10 }, py: 4 , minHeight:'50vh' }}  >
      <Typography 
        variant="h4" 
        fontWeight="bold" 
        mb={4}
        textAlign="center"
      >
        Your Favorites
      </Typography>

      <Grid container spacing={4}>
        {favorite.length > 0 ? (
          favorite.map((item, index) => (
            <Grid 
              item 
              key={index} 
              xs={12} 
              sm={6} 
              md={4} 
              lg={3}
              display="flex"
              justifyContent="center"
            >
              <ProductCard item={item} />
            </Grid>
          ))
        ) : (
          <Typography variant="h6" textAlign="center" width="100%">
            No favorites yet!
          </Typography>
        )}
      </Grid>
    </Box>
  );
};

export default Favorites;
