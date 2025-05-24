import React from 'react';
import {
    AppBar,
    Toolbar,
    Typography,
    Box,
    IconButton,
    Menu,
    MenuItem,
    ListItemIcon,
} from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LogoutIcon from '@mui/icons-material/Logout';
import { Link, useNavigate } from 'react-router-dom';
import {useDispatch} from 'react-redux';
import axios from 'axios';
import { toast } from 'react-toastify';
import Logo from '../assets/Logo.png';
import { setAdmin } from '../../../Frontend/src/redux/authSlice';

export default function Navbar() {
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);
    const url = 'http://localhost:3000';
    const dispatch = useDispatch();
    const navigate = useNavigate('');

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const logoutHandler = async () => {
        try {
            const response = await axios.post(`${url}/api/user/logout`);
            if (response.data.success) {
                toast.success(response.data.message);
                navigate('/login');
                dispatch(setAdmin(null));
            }
        } catch (error) {
            console.log(error);
        }
    }

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

                    {/* Profile & Cart */}
                    <Box sx={{ display: 'flex' }}>
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

                        <MenuItem onClick={() => { handleClose(); logoutHandler() }}>
                            <Link style={{ textDecoration: 'none', color: 'black', display: 'flex', gap: 5 }} >
                                <ListItemIcon><LogoutIcon fontSize="small" /></ListItemIcon>
                                <Typography variant="inherit" >Logout</Typography>
                            </Link>
                        </MenuItem>
                    </Menu>
                </div>
            </AppBar>


        </>
    );
}
