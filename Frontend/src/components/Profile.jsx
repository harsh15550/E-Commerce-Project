import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Avatar,
  Box,
  Grid,
  Paper,
  Typography,
  Stack,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  CircularProgress,
} from '@mui/material';

import EditIcon from '@mui/icons-material/Edit';
import axios from 'axios';
import { toast } from 'react-toastify';
import { setUser } from '../redux/authSlice';
import ProductCard from './ProductCard';

const Profile = () => {
  const { user } = useSelector(store => store.user);
  const [openDialog, setOpenDialog] = useState(false);
  const [loading, setLoading] = useState(false);
  const [profileImage, setProfileImage] = useState(user.profileImage || '');
  const [previewProfile, setPreviewImage] = useState(user.profileImage || '');
  const [firstName, setfirstName] = useState(user.firstName || '');
  const [lastName, setLastName] = useState(user.lastName || '');
  const [phone, setPhone] = useState(user.phone || '');
  const [address, setAddress] = useState(user.address || '');
  const [storeName, setStoreName] = useState(user.storeName || '');
  const [storeDescription, setStoreDescription] = useState(user.storeDescription || '');
  const [gstNumber, setGstNumber] = useState(user.gstNumber || '');
  const [favourite, setFavourite] = useState([]);
  const dispatch = useDispatch('');

  const url = 'https://e-commerce-project-6wl4.onrender.com';

  const handleProfileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImage(file);
      setPreviewImage(URL.createObjectURL(file)); // for showing in Avatar

    }
  };

  const handleEditProfile = async () => {
    // e.preventDefault();
    setLoading(true)
    try {

      const formData = new FormData();
      formData.append('profileImage', profileImage);
      formData.append('firstName', firstName);
      formData.append('lastName', lastName);
      formData.append('storeDescription', storeDescription);
      formData.append('phone', phone);
      formData.append('address', address);
      formData.append('storeName', storeName);
      formData.append('gstNumber', gstNumber);

      const response = await axios.post('https://e-commerce-project-6wl4.onrender.com/api/user/edit', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        withCredentials: true
      })

      if (response.data.success) {
        toast.success(response.data.message);
        dispatch(setUser(response.data.updatedProfile));
        setOpenDialog(false);
        setLoading(false)
      }
    } catch (error) {
      console.log(error);
    }
  }

  const getFavoriteProduct = async () => {
    try {
      const response = await axios.get(`${url}/api/user/getfavorite`, { withCredentials: true });
      if (response.data.success) {
        setFavourite(response.data.favourite);
      }
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    getFavoriteProduct();
  }, [])

  return (
    <Box sx={{ mt: 5, ml: '100px' }}>
      <Grid container spacing={4}>
        <Grid>
          <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
            <Box display="flex" flexDirection="column" alignItems="center" gap={2}>
              <Avatar
                src={`${user.profileImage}`}
                alt={user.name}
                sx={{ width: 130, height: 130, border: '3px solid #1976d2' }}
              />
              <Typography variant="h6" fontWeight="bold">
                @ {user.firstName}
              </Typography>
              <Typography color="text.secondary">{user.phone}</Typography>
              <Box>
                <Typography sx={{ mb: 1 }} color="text.secondary">Cloths</Typography>
                <Typography sx={{ mb: 1 }} color="text.secondary">Electronic</Typography>
                <Typography sx={{ mb: 1 }} color="text.secondary">Books</Typography>
                <Typography sx={{ mb: 1 }} color="text.secondary">Gifts</Typography>
                <Typography sx={{ mb: 1 }} color="text.secondary">Toys</Typography>
                <Typography sx={{ mb: 1 }} color="text.secondary">shoes</Typography>
              </Box>
            </Box>
          </Paper>
        </Grid>

        <Grid>
          <Paper
            sx={{
              p: 4,
              borderRadius: 4,
              border: '1px solid #ccc',
              width: '1000px',
              boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.05)',
              backgroundColor: '#fafafa',
            }}
          >
            <Stack sx={{ display: 'flex', justifyContent: 'space-between', flexDirection: 'row' }} >
              <Stack spacing={3} mb={5} sx={{ maxWidth: '840px' }} >
                {user.role === 'seller' &&
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary">
                      Store Name
                    </Typography>
                    <Typography variant="h6" fontWeight="bold">
                      {user.storeName}
                    </Typography>
                  </Box>
                }

                {user.role === 'seller' &&
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary">
                      Store Description
                    </Typography>
                    <Typography variant="body1">{user.storeDescription}</Typography>
                  </Box>
                }

                {user.role === 'seller' &&
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary">
                      GST Number
                    </Typography>
                    <Typography variant="body1">{user.gstNumber}</Typography>
                  </Box>
                }
              </Stack>

              <Button
                variant="outlined"
                startIcon={<EditIcon />}
                onClick={() => setOpenDialog(true)}
                sx={{
                  borderRadius: '8px',
                  textTransform: 'none',
                  fontWeight: 'bold',
                  height: '40px'
                }}
              >
                Edit Profile
              </Button>
            </Stack>

            {/* Edit Profile Popup  */}

            <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
              <DialogTitle>Edit Profile</DialogTitle>
              <DialogContent dividers>
                <Stack spacing={2} mt={1}>
                  <Stack direction="row" alignItems="center" spacing={2}>
                    <Avatar
                      src={previewProfile}
                      sx={{ width: 64, height: 64, border: '2px solid #ccc' }}
                    />
                    <Button variant="contained" component="label">
                      Upload Image
                      <input
                        type="file"
                        hidden
                        accept="image/*"
                        name="profileImage"
                        onChange={handleProfileChange}
                      />
                    </Button>
                  </Stack>

                  <Box sx={{ display: 'flex', gap: 2 }} >

                    <TextField
                      label="First Name"
                      fullWidth
                      name="name"
                      value={firstName}
                      onChange={(e) => setfirstName(e.target.value)}
                      InputProps={{
                        sx: { height: 50 },
                      }}
                    />
                    <TextField
                      label="Last Name"
                      fullWidth
                      name="name"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      InputProps={{
                        sx: { height: 50 },
                      }}
                    />
                  </Box>
                  <TextField
                    label="Phone"
                    fullWidth
                    name="phone"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    InputProps={{
                      sx: { height: 50 },
                    }}
                  />

                  <TextField
                    label="Address"
                    fullWidth
                    name="address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    InputProps={{
                      sx: { height: 50 },
                    }}
                  />
                  {user.role === 'seller' &&

                    <Box>
                      <TextField
                        label="Store Name"
                        fullWidth
                        name="storeName"
                        value={storeName}
                        onChange={(e) => setStoreName(e.target.value)}
                        InputProps={{
                          sx: { height: 50, mb: 2 },
                        }}
                      />
                      <TextField
                        label="Store Description"
                        fullWidth
                        multiline
                        rows={3}
                        name="storeDescription"
                        value={storeDescription}
                        onChange={(e) => setStoreDescription(e.target.value)}
                        sx={{ mb: 2 }}
                      />
                      <TextField
                        label="GST Number"
                        fullWidth
                        name="gstNumber"
                        value={gstNumber}
                        onChange={(e) => setGstNumber(e.target.value)}
                        InputProps={{
                          sx: { height: 50 },
                        }}
                      />
                    </Box>
                  }
                </Stack>
              </DialogContent>

              <DialogActions>
                <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
                <Button
                  variant="contained"
                  onClick={handleEditProfile}
                  disabled={loading}
                  sx={{ minWidth: 120 }}
                >
                  {loading ? <CircularProgress size={20} color="inherit" /> : 'Save'}
                </Button>
              </DialogActions>
            </Dialog>


            <Box>
              <Typography mb={3} variant="h6" fontWeight="bold" gutterBottom>
                Favourite Products
              </Typography>
              <Grid sx={{ display: 'flex', justifyContent: 'flex-start', maxHeight: '900px', maxWidth: '1050px', overflowX: 'auto', scrollbarWidth: 'none' }} container spacing={1.6}>
                {favourite?.map((item, index) => (
                  <Grid key={index} >
                    <ProductCard item={item} />
                  </Grid>
                ))}
              </Grid>
            </Box>
          </Paper>
        </Grid>

      </Grid>
    </Box>

  );
};

export default Profile;
