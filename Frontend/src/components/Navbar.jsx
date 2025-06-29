import React, { useEffect, useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  IconButton,
  Button,
  Menu,
  MenuItem,
  ListItemIcon,
  Badge,
  InputBase,
  Dialog,
  DialogContent,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Paper,
  InputAdornment
} from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import PersonIcon from '@mui/icons-material/Person';
import FavoriteIcon from '@mui/icons-material/Favorite';
import LogoutIcon from '@mui/icons-material/Logout';
import DashboardIcon from '@mui/icons-material/Dashboard';
import CartDrawer from './CartDrawer ';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import { setUser } from '../redux/authSlice';
import { setCartItems } from '../redux/cartSlice';
import SearchIcon from '@mui/icons-material/Search';
import Logo from '../assets/Logo.png';
import { setMessage } from '../redux/chatSlice';

export default function Navbar() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const { user } = useSelector(store => store.user);
  const { cartItems } = useSelector(store => store.cartItems);
  const open = Boolean(anchorEl);
  const url = 'https://e-commerce-project-6wl4.onrender.com';
  const dispatch = useDispatch();
  const navigate = useNavigate('');
  const [openDialog, setOpenDialog] = useState(false);
  const { allProduct } = useSelector(store => store.products)
  const [searchProduct, setSearchProduct] = useState('');
  const [filteredProducts, setFilteredProducts] = useState(allProduct); // allProduct: from API
  console.log(filteredProducts);
  

  const toggleDrawer = (open) => () => {
    setDrawerOpen(open);
  };

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const logoutHandler = async () => {
    try {
      const response = await axios.post(`${url}/api/user/logout`, null, {withCredentials: true});
      if (response.data.success) {
        toast.success(response.data.message);
        navigate('/login');
        dispatch(setUser(null));
        dispatch(setCartItems([]))
        dispatch(setMessage([]))
      }
    } catch (error) {
      console.log(error);
    }
  }

  const handleSearch = async () => {
    try {
      const response = await axios.get(`${url}/api/product/searchProduct?productname=${searchProduct}`, { withCredentials: true });

      if (response.data.success) {
        setFilteredProducts(response.data.products)
      }
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    if(searchProduct) handleSearch();
  }, [searchProduct])

  return (
    <>
      <AppBar color="default" position='static' elevation={1}>
        <Toolbar sx={{ justifyContent: 'space-between', height: '85px', ml: '80px', mr: '80px' }}>
          {/* Logo */}
          <Link to={'/'} style={{ textDecoration: 'none' }}  >
            <Typography component="div" sx={{ fontWeight: 'bold', color: 'black' }}>
              <img src={Logo} alt="" style={{ height: '65px' }} />
            </Typography>
          </Link>

          {/* Navigation */}
          <Box sx={{ display: 'flex', gap: 2 }}>
            <NavLink
              to="/"
              style={({ isActive }) => ({
                textDecoration: 'none',
                color: 'black',
                borderBottom: isActive ? '2px solid orange' : 'none'
              })}
            >
              <Button color="inherit">Home</Button>
            </NavLink>

            <NavLink
              to="/product"
              style={({ isActive }) => ({
                textDecoration: 'none',
                color: 'black',
                borderBottom: isActive ? '2px solid orange' : 'none'
              })}
            >
              <Button color="inherit">Products</Button>
            </NavLink>

            <NavLink
              to="/about"
              style={({ isActive }) => ({
                textDecoration: 'none',
                color: 'black',
                borderBottom: isActive ? '2px solid orange' : 'none'
              })}
            >
              <Button color="inherit">About</Button>
            </NavLink>

            <NavLink
              to="/contact"
              style={({ isActive }) => ({
                textDecoration: 'none',
                color: 'black',
                borderBottom: isActive ? '2px solid orange' : 'none'
              })}
            >
              <Button color="inherit">Contact Us</Button>
            </NavLink>

          </Box>
          {/* Profile & Cart */}
          <Box sx={{ display: 'flex' }}>
            <IconButton
              color="inherit"
              onClick={() => setOpenDialog(true)}
              sx={{ '&:hover': { backgroundColor: 'rgba(0,0,0,0.1)' } }}
            >
              <SearchIcon sx={{ fontSize: '33px' }} />
            </IconButton>
            <IconButton color="inherit" onClick={toggleDrawer(true)}>
              <Badge
                badgeContent={cartItems.length}
                color="warning"
                showZero={false} // important!
                overlap="rectangular"
                sx={{
                  '& .MuiBadge-badge': {
                    top: 1,
                    right: 1,
                    height: 18,
                    minWidth: 15,
                  },
                }}
              >
                <ShoppingCartIcon sx={{ fontSize: '33px' }} />
              </Badge>
            </IconButton>

            <IconButton
              color="inherit"
              onClick={handleClick}
              sx={{ '&:hover': { backgroundColor: 'rgba(0,0,0,0.1)' } }}
            >
              <AccountCircleIcon sx={{ fontSize: '33px' }} />
            </IconButton>
          </Box>
        </Toolbar>
        <div>
          <Menu
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            PaperProps={{
              elevation: 3,
              sx: {
                borderRadius: 2,
                backgroundColor: 'white',
                mt: 1,
                width: 180,
              }
            }}
          >
            <MenuItem component={Link} to="/profile" onClick={handleClose} >
              <ListItemIcon><PersonIcon fontSize="small" /></ListItemIcon>
              <Typography variant="inherit">Profile</Typography>
            </MenuItem>

            {user?.role === 'seller' &&
              <MenuItem component={Link} to="/dashboard/home" onClick={handleClose}>
                <ListItemIcon><DashboardIcon fontSize="small" /></ListItemIcon>
                <Typography variant="inherit">Dashboard</Typography>
              </MenuItem>
            }

            <MenuItem component={Link} to="/myorders" onClick={handleClose} >
              <ListItemIcon><ShoppingCartIcon fontSize="small" /></ListItemIcon>
              <Typography variant="inherit">Orders</Typography>
            </MenuItem>

            <MenuItem component={Link} to="/favorites" onClick={handleClose}>
              <ListItemIcon><FavoriteIcon fontSize="small" /></ListItemIcon>
              <Typography variant="inherit">Favorites</Typography>
            </MenuItem>

            <MenuItem onClick={() => { handleClose(); logoutHandler() }}>
              <Link style={{ textDecoration: 'none', color: 'black', display: 'flex', gap: 5 }} >
                <ListItemIcon><LogoutIcon fontSize="small" /></ListItemIcon>
                <Typography variant="inherit" >Logout</Typography>
              </Link>
            </MenuItem>
          </Menu>
        </div>
      </AppBar>

      {/* Search Dialog Box  */}
      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        PaperProps={{
          sx: {
            width: '500px',
            maxHeight: '80vh',
            m: 'auto',
            borderRadius: 4,
            boxShadow: 6,
            p: 0,
          },
        }}
      >
        {/* Search Bar */}
        <Paper
          elevation={0}
          sx={{
            px: 2,
            py: 1.5,
            borderBottom: '1px solid #e0e0e0',
            borderRadius: '8px 8px 0 0',
            backgroundColor: '#fafafa',
          }}
        >
          <InputBase
            fullWidth
            value={searchProduct}
            onChange={(e) => setSearchProduct(e.target.value)}
            placeholder="Search products..."
            startAdornment={
              <InputAdornment position="start">
                <SearchIcon sx={{ color: 'gray' }} />
              </InputAdornment>
            }
            sx={{
              px: 1.5,
              py: 1,
              border: '1px solid #ddd',
              borderRadius: 2,
              backgroundColor: '#fff',
              fontSize: '15px',
              transition: 'border 0.2s ease-in-out',
              '&:focus-within': {
                borderColor: '#1976d2',
              },
            }}
          />
        </Paper>

        {/* Product List */}
        <DialogContent dividers sx={{ px: 2, py: 1.5, backgroundColor: '#fcfcfc' }}>
          {filteredProducts.length ? (
            filteredProducts.map((product) => (
              <NavLink
                to={`/productDetail/${product._id}`}
                key={product._id}
                onClick={() => setOpenDialog(false)}
                style={{ textDecoration: 'none', color: 'inherit' }}
              >
                <Card
                  variant="outlined"
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    p: 1.5,
                    borderRadius: 3,
                    mb: 1.5,
                    transition: 'all 0.2s ease-in-out',
                    '&:hover': {
                      boxShadow: 2,
                      backgroundColor: '#f5f5f5',
                    },
                  }}
                >
                  <CardMedia
                    component="img"
                    image={product.productimgs[0]}
                    alt={product.name}
                    sx={{
                      width: 60,
                      height: 60,
                      borderRadius: 2,
                      objectFit: 'cover',
                    }}
                  />
                  <Box sx={{ ml: 2, flex: 1 }}>
                    <Typography variant="subtitle1" fontWeight={600}>
                      {product.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      ₹{product.price}
                    </Typography>
                  </Box>
                </Card>
              </NavLink>
            ))
          ) : (
            <Typography sx={{ mt: 2, textAlign: 'center', color: 'text.secondary' }}>
              No products found.
            </Typography>
          )}
        </DialogContent>
      </Dialog>




      {/* Drawer */}
      <CartDrawer drawerOpen={drawerOpen} toggleDrawer={toggleDrawer} />
    </>
  );
}
