import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
} from '@mui/material'; 
import DashboardIcon from '@mui/icons-material/Dashboard';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import ReviewsIcon from '@mui/icons-material/Reviews';
import InventoryIcon from '@mui/icons-material/Inventory';
import StorefrontIcon from '@mui/icons-material/Storefront';
import InsertCommentIcon from '@mui/icons-material/InsertComment';
import { NavLink } from 'react-router-dom';

const LeftSidebar = () => {

  const navigationList = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/home' },
    { text: 'My Products', icon: <StorefrontIcon />, path: '/products' },
    { text: 'Orders', icon: <ShoppingCartIcon />, path: '/orders' },
    { text: 'Reviews', icon: <ReviewsIcon />, path: '/reviews' },
    { text: 'Total Sale Product', icon: <InventoryIcon />, path: '/totalsale' },
    { text: 'Messages', icon: <InsertCommentIcon />, path: '/messages' }
  ];

  return (
    <Box
      sx={{
        width: '250px',
        height: '100vh',
        bgcolor: '#f5f5f5',
        p: 3,
        boxShadow: 3,
      }}
    >
      {/* Seller Info */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" fontWeight="bold" color="text.primary">
          👤 Seller Dashboard
        </Typography>
      </Box>

      <Divider sx={{ mb: 2 }} />

      {/* Navigation List */}
      <List>
        {navigationList.map((item, index) => (
          <NavLink
            to={`/dashboard${item.path}`}
            key={index}
            style={{ textDecoration: 'none', color: 'black' }}
          >
            {({ isActive }) => (
              <ListItem disablePadding>
                <ListItemButton
                  sx={{
                    backgroundColor: isActive ? '#e0e0e0' : 'transparent',
                    borderRadius: '10px',
                    '&:hover': {
                      backgroundColor: '#e0e0e0', // slightly darker gray on hover
                    },
                    transition: 'background-color 0.3s ease' // smooth hover transition
                  }}
                >
                  <ListItemIcon>{item.icon}</ListItemIcon>
                  <ListItemText primary={item.text} />
                </ListItemButton>
              </ListItem>
            )}
          </NavLink>
        ))}
      </List>
    </Box>
  )
}

export default LeftSidebar