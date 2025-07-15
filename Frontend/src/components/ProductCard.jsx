import React, { useState } from 'react';
import {
  Box,
  Card,
  CardMedia,
  CardContent,
  Typography,
  IconButton,
  Rating
} from '@mui/material';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setUser } from '../redux/authSlice';

const ProductCard = ({ item }) => {

  const { user } = useSelector(store => store.user);

  const url = 'http://localhost:3000';
  const [isFavourite, setIsFavourite] = useState(user?.favourite.includes(item._id) || false); // Default from DB or false
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/productDetail/${item._id}`);
  };

  const handleAddToFavourite = async (event) => {
    event.stopPropagation(); // Prevents card click
    try {
      const response = await axios.post(`${url}/api/user/favorite/${item._id}`, {}, { withCredentials: true });

      if (response.data.success) {
        let updatedFavorites;

        if (isFavourite) {
          updatedFavorites = user.favourite.filter(id => id !== item._id);
        } else {
          updatedFavorites = [...user.favourite, item._id];
        }

        // Update user object with new favorites
        const updatedUser = { ...user, favourite: updatedFavorites };
        dispatch(setUser(updatedUser));
        setIsFavourite(prev => !prev); // Toggle favourite state
        toast.success(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    }
  };

  let originalAverage = item?.reviews?.reduce((acc, review) => acc + review?.rating, 0) / item?.reviews?.length;

  // 2. Display ke liye: 2 decimal tak original value
  const displayStarValue = Number(originalAverage.toFixed(2));

  // 3. Stars ke liye: nearest 0.5 rounding
  const starValue = Math.round(originalAverage * 2) / 2;


  return (
    <Box sx={{ bgcolor: '#fff', py: 0.5 }}>
      <Box sx={{ display: 'flex', justifyContent: 'center', cursor: 'pointer' }}>
        <Card
          onClick={handleCardClick}
          sx={{
            width: 240,
            height: 350,
            borderRadius: 2,
            boxShadow: 2,
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            position: 'relative',
            transition: 'transform 0.3s ease, box-shadow 0.3s ease',
            '&:hover': {
              transform: 'scale(1.02)',
              boxShadow: 4,
            },
          }}
        >
          {/* Like Button */}
          <IconButton
            sx={{
              position: 'absolute',
              top: 10,
              right: 10,
              backgroundColor: '#fff',
              zIndex: 2,
              boxShadow: 1,
              '&:hover': {
                backgroundColor: '#f5f5f5',
              },
            }}
            onClick={handleAddToFavourite}
          >
            {isFavourite ? (
              <FavoriteIcon sx={{ color: 'red' }} />
            ) : (
              <FavoriteBorderIcon />
            )}
          </IconButton>

          {/* Product Image */}
          <CardMedia
            component="img"
            image={item.productimgs[0]}
            alt={item.name}
            sx={{
              minHeight: 250,
              maxHeight: 250,
              width: '100%',
              objectFit: 'cover',
            }}
          />

          {/* Product Content */}
          <CardContent
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: 0.8,
              px: 1.5,
              py: 1,
              flexGrow: 1,
            }}
          >
            <Typography
              variant="subtitle2"
              fontWeight={600}
              noWrap
              sx={{ fontSize: '14px' }}
            >
              {item.name}
            </Typography>

            {/* Rating */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
              <Rating value={starValue} precision={0.5} readOnly size="small" />
              <Typography variant="body2" color="text.secondary" fontWeight={500}>
                {displayStarValue} / 5
              </Typography>
            </Box>

            {/* Price Section */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
              <Typography variant="body1" fontWeight="bold" color="primary">
                ₹{Math.round(item?.price - (item?.price * item?.discount) / 100)}
              </Typography>
              <Typography
                variant="body2"
                sx={{ textDecoration: 'line-through', color: 'text.secondary' }}
              >
                ₹{item?.price}
              </Typography>
              <Typography variant="caption" sx={{ color: 'green', fontWeight: 600 }}>
                ({item?.discount}% OFF)
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Box>


  );
};

export default ProductCard;
