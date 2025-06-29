import {
  Button, Drawer, Box, Typography, IconButton, Divider, Checkbox,
  FormControlLabel, TextField, Slider, Menu, MenuItem, Grid,
  FormControl, RadioGroup, Radio
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ProductCard from './ProductCard';
import TuneIcon from '@mui/icons-material/Tune';
import CloseIcon from '@mui/icons-material/Close';
import SortIcon from '@mui/icons-material/Sort';
import axios from 'axios';
import { setAllProducts } from '../redux/productSlice';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const ProductsPage = () => {
  const [open, setOpen] = useState(false);
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [priceRange, setPriceRange] = useState([0, 5000]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedOption, setSelectedOption] = useState('Sort By');
  const [selectedRating, setSelectedRating] = useState('');
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);

  const dispatch = useDispatch();
  const { allProduct } = useSelector(store => store.products);
  const url = 'https://e-commerce-project-6wl4.onrender.com';
  
  const toggleDrawer = (open) => () => {
    setOpen(open);
  };

  const handleCategoryChange = (category) => {
    setSelectedCategories((prev) =>
      prev.includes(category) ? prev.filter(c => c !== category) : [...prev, category]
    );
  };

  let filtered = [...allProduct];
  const handleApplyFilter = () => {

    // Filter by category
    if (selectedCategories.length > 0) {
      filtered = filtered.filter(product => selectedCategories.includes(product.mainCategory));
    }

    // Filter by rating
    if (selectedRating) {
      const ratingThreshold = parseFloat(selectedRating);
    
      filtered = filtered.filter(product => {
        if (!product.reviews || product.reviews.length === 0) return false;
    
        const totalRating = product.reviews.reduce((sum, r) => sum + r.rating, 0);
        const avgRating = totalRating / product.reviews.length;
    
        return avgRating >= ratingThreshold;
      });
    }
    

    // Filter by price range
    const min = minPrice !== '' ? parseFloat(minPrice) : priceRange[0];
    const max = maxPrice !== '' ? parseFloat(maxPrice) : priceRange[1];
    filtered = filtered.filter(product => Math.round(product?.price - (product?.price * product?.discount) / 100) >= min && Math.round(product?.price - (product?.price * product?.discount) / 100) <= max);

    // Sort
    

    setFilteredProducts(filtered);
    setOpen(false); // close drawer
  };

  const handleChange = (event, newValue) => {
    setPriceRange(newValue);
    setMinPrice('');
    setMaxPrice('');
  };

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSortOption = (option) => {
    setSelectedOption(option);
  
    if (option === 'Ascending') {
      filtered.sort((a, b) => Math.round(a?.price - (a?.price * a?.discount) / 100) - Math.round(b?.price - (b?.price * b?.discount) / 100));
    } else if (option === 'Descending') {
      filtered.sort((a, b) => Math.round(b?.price - (b?.price * b?.discount) / 100) - Math.round(a?.price - (a?.price * a?.discount) / 100));
    }

    setFilteredProducts(filtered)
  
    handleClose();
  };
  

  const getAllProduct = async () => {
    try {
      const response = await axios.get(`${url}/api/product/getAllProduct`);
      if (response.data.success) {
        dispatch(setAllProducts(response.data.products));
        setFilteredProducts(response.data.products); // show all initially
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getAllProduct();
  }, []);

  return (
    <Box sx={{ py: 4, bgcolor: '#fff' }}>
      {/* Filter + Sort */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mr: '100px', ml: '100px' }}>
        <Button
          variant="contained"
          startIcon={<TuneIcon />}
          onClick={toggleDrawer(true)}
          sx={{ bgcolor: '#f5f5f5', color: 'blue', fontWeight: 'bold', borderRadius: 2 }}
        >
          Filter
        </Button>

        <Button
          variant="contained"
          startIcon={<SortIcon />}
          onClick={handleClick}
          sx={{ bgcolor: '#f5f5f5', color: 'blue', fontWeight: 600, borderRadius: 2, mr: 2 }}
        >
          {selectedOption}
        </Button>

        <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
          <MenuItem onClick={() => handleSortOption('Descending')}>
            <ExpandMoreIcon fontSize="small" sx={{ mr: 1 }} />
            
            High To Low
          </MenuItem>
          <MenuItem onClick={() => handleSortOption('Ascending')}>
            <ExpandLessIcon fontSize="small" sx={{ mr: 1 }} />
            Low To High
          </MenuItem>
        </Menu>
      </Box>

      {/* Filter Drawer */}
      <Drawer anchor="left" open={open} onClose={toggleDrawer(false)}>
        <Box sx={{ width: 300, p: 3 }}>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h6">Filters</Typography>
            <IconButton onClick={toggleDrawer(false)}>
              <CloseIcon />
            </IconButton>
          </Box>
          <Divider sx={{ mb: 2 }} />

          {/* Categories */}
          <Typography fontWeight="bold">Category</Typography>
          {['Clothes', 'Footwear', 'Electronics', 'Furniture', 'Beauty', 'Sports'].map((cat) => (
            <FormControlLabel
              key={cat}
              control={
                <Checkbox
                  checked={selectedCategories.includes(cat)}
                  onChange={() => handleCategoryChange(cat)}
                />
              }
              label={cat}
            />
          ))}
          <Divider sx={{ my: 2 }} />

          {/* Price Range Slider */}
          <Typography fontWeight="bold">Price Range (Slider)</Typography>
          <Slider
            value={priceRange}
            onChange={handleChange}
            valueLabelDisplay="auto"
            min={0}
            max={5000}
            sx={{ color: 'black' }}
          />
          <Divider sx={{ my: 1 }} />

          {/* Rating */}
          <Typography fontWeight="bold">Customer Rating</Typography>
          <FormControl component="fieldset">
            <RadioGroup
              value={selectedRating}
              onChange={(e) => setSelectedRating(e.target.value)}
            >
              <FormControlLabel value="4" control={<Radio />} label="4★ & above" />
              <FormControlLabel value="3" control={<Radio />} label="3★ & above" />
              <FormControlLabel value="2" control={<Radio />} label="2★ & above" />
              <FormControlLabel value="1" control={<Radio />} label="1★ & above" />
            </RadioGroup>
          </FormControl>
          <Divider sx={{ my: 2 }} />

          {/* Price Input */}
          <Typography fontWeight="bold">Price Range</Typography>
          <Box display="flex" gap={2} mb={2}>
            <TextField
              label="Min"
              type="number"
              size="small"
              fullWidth
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
            />
            <TextField
              label="Max"
              type="number"
              size="small"
              fullWidth
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
            />
          </Box>
          <Divider sx={{ my: 2 }} />

          <Button
            fullWidth
            onClick={handleApplyFilter}
            sx={{ bgcolor: 'black', color: 'white', fontWeight: 'bold', fontSize: '16px' }}
          >
            Apply Filter
          </Button>
        </Box>
      </Drawer>

      {/* Product Grid */}
      <Grid container spacing={3} sx={{ px: '100px', mt: 4 }}>
        {filteredProducts?.map((item, index) => (
          <Grid item key={index}>
            <ProductCard item={item} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default ProductsPage;
