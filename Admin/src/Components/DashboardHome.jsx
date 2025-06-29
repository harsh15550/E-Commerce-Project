import React, { useEffect, useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Avatar,
  Select,
  MenuItem,
} from '@mui/material';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';

const DashboardHome = () => {
  const url = 'https://e-commerce-project-6wl4.onrender.com';
  const [orders, setOrders] = useState([]);
  const [rows, setRows] = useState([]);
  const [totalSale, setTotalSale] = useState();
  const [totalReviews, setTotalReviews] = useState();
  const [totalProducts, setTotalProducts] = useState();
  const { allProduct } = useSelector(store => store.products);
  const [reviews, setReviews] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [users, setUsers] = useState([]);

  const handleChangePage = (event, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  
  const getAllProduct = async () => {
    try {
      const response = await axios.get(`${url}/api/product/getAllProduct`);
      if (response.data.success) {
        setTotalProducts(response.data.products)
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getAllProduct();
  }, []);

  const getAllOrders = async () => {
    try {
      const response = await axios.get(`${url}/api/admin/order`, { withCredentials: true });

      if (response.data.success) {
        setOrders(response.data.orders);
      }
    } catch (error) {
      console.log(error);
    }
  }

  const getUsers = async () => {
    try {
      const response = await axios.get(`${url}/api/admin/users`, { withCredentials: true });
      console.log(response.data.users);

      if (response.data.success) {
        const user = response.data.users.filter(u => u.role === 'seller' && !u.isVerifiedSeller);
        setUsers(user);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getUsers();
  }, [])

  const handleSellerPermission = async (userId, newPermission) => {
    try {
      const res = await axios.put(`${url}/api/admin/permission/${userId}`, {
        userId,
        isVerifiedSeller: newPermission
      }, { withCredentials: true });

      if (res.data.success) {
        toast.success(res.data.message);
        getUsers();
      }
    } catch (error) {
      toast.error("Failed to update permission");
      console.log(error);
    }
  };

  const getAllReviews = async () => {
    try {
      const response = await axios.get(`${url}/api/admin/review`, { withCredentials: true });

      if (response.data.success) {
        setReviews(response.data.review);
      }
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    const totalSale = orders.reduce((total, item) => total + Math.round(item.products[0].price), 0);
    setTotalSale(totalSale);
  }, [rows, orders]);


  useEffect(() => {
    setTotalReviews(
      rows.reduce((total, item) => total + item.reviews.length, 0)
    );
  }, [rows])

  useEffect(() => {
    getAllReviews();
    getAllOrders();
  }, [])

  return (
    <Box p={6}>

      <Grid container spacing={3}>
        {/* Total Products */}
        <Grid>
          <Paper
            elevation={4}
            sx={{
              background: 'linear-gradient(135deg, #667eea, #764ba2)',
              color: 'white',
              p: 4,
              borderRadius: 3,
              height: 100,
              width: 195,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
            }}
          >
            <Typography variant="h6" gutterBottom>
              Total Products
            </Typography>
            <Typography variant="h4">{totalProducts?.length}</Typography>
          </Paper>
        </Grid>

        {/* Total Orders */}
        <Grid>
          <Paper
            elevation={4}
            sx={{
              background: 'linear-gradient(135deg, #f7971e, #ffd200)',
              color: 'white',
              p: 4,
              borderRadius: 3,
              width: 200,
              height: 100,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
            }}
          >
            <Typography variant="h6" gutterBottom>
              Total Orders
            </Typography>
            <Typography variant="h4">{orders.length}</Typography>
          </Paper>
        </Grid>

        {/* Total Sales */}
        <Grid>
          <Paper
            elevation={4}
            sx={{
              background: 'linear-gradient(135deg, #56ab2f, #a8e063)',
              color: 'white',
              p: 4,
              borderRadius: 3,
              height: 100,
              width: 195,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
            }}
          >
            <Typography variant="h6" gutterBottom>
              Total Sales
            </Typography>
            <Typography variant="h4">₹{totalSale}</Typography>
          </Paper>
        </Grid>

        {/* Total Reviews */}
        <Grid>
          <Paper
            elevation={4}
            sx={{
              background: 'linear-gradient(135deg, #ff6a00, #ee0979)',
              color: 'white',
              p: 4,
              borderRadius: 3,
              height: 100,
              width: 195,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
            }}
          >
            <Typography variant="h6" gutterBottom sx={{ fontFamily: 'Poppins, sans-serif' }}>
              Total Reviews
            </Typography>
            <Typography variant="h4">
              {reviews.length}
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* Product Table */}
      <Box mt={6}>
        <Typography variant="h5" fontWeight="bold" mb={2}>
          Users Who Have Not Been Granted Permission
        </Typography>
        <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell align="center"><strong>Profile</strong></TableCell>
                <TableCell align="center"><strong>Name</strong></TableCell>
                <TableCell align="center"><strong>Phone</strong></TableCell>
                <TableCell align="center"><strong>GST</strong></TableCell>
                <TableCell align="center"><strong>Store Name</strong></TableCell>
                <TableCell align="center"><strong>Store Description</strong></TableCell>
                <TableCell align="center"><strong>Role</strong></TableCell>
                <TableCell align="center"><strong>Seller Access</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row) => (
                  <TableRow
                    key={row._id}
                    hover
                    sx={{
                      '& td, & th': {
                        borderBottom: '1px solid rgba(224, 224, 224, 1)', // Fixes row line
                      },
                    }}
                  >
                    <TableCell align="center">
                      <Avatar src={row.profileImage} sx={{ width: 45, height: 45, mx: 'auto' }} />
                    </TableCell>
                    <TableCell align="center">{row.firstName}</TableCell>
                    <TableCell align="center">{row.phone}</TableCell>
                    <TableCell align="center" sx={{ maxWidth: 120, minWidth: 120, }} >{row.gstNumber || row.role === 'seller' && '—'}</TableCell>
                    <TableCell align="center" sx={{ maxWidth: 120, minWidth: 120, }}>{row.storeName || row.role === 'seller' && '—'}</TableCell>
                    <TableCell
                      align="center"
                      sx={{
                        maxWidth: 300,
                        minWidth: 300,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical'
                      }}
                      style={{ height: '45px' }}
                    >
                      {row.storeDescription || row.role === 'seller' && '—'}
                    </TableCell>
                    <TableCell align="center"><strong>{row.role}</strong></TableCell>
                    {row.role === 'seller' &&
                      <TableCell align="center">
                        <Select
                          size="small"
                          value={row.isVerifiedSeller ? 'true' : 'false'}
                          onChange={(e) =>
                            handleSellerPermission(row._id, e.target.value)
                          }
                        >
                          <MenuItem value={false}>No</MenuItem>
                          <MenuItem value={true}>Yes</MenuItem>
                        </Select>
                      </TableCell>
                    }
                  </TableRow>
                ))}
            </TableBody>

          </Table>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={users.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </TableContainer>
      </Box>
    </Box>
  );
};

export default DashboardHome;
