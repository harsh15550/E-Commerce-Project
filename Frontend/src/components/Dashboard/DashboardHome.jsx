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
  CircularProgress,
} from '@mui/material';
import axios from 'axios';

const DashboardHome = () => {
  const url = 'http://localhost:3000';
  const [orders, setOrders] = useState([]);
  const [rows, setRows] = useState([]);
  const [totalSale, setTotalSale] = useState();
  const [totalReviews, setTotalReviews] = useState();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const getSellerOrder = async () => {
    try {
      const response = await axios.get(`${url}/api/order/sellerOrder`, { withCredentials: true });
      if (response.data.success) {
        setOrders(response.data.orders);
        setLoading(false);
      }
    } catch (error) {
      console.log(error);
    }
  }

  const getSellerProducts = async () => {
    try {
      const response = await axios.get(`${url}/api/product/getSellerProduct`, { withCredentials: true });
      if (response.data.success) {
        setRows(response.data.products)
      }
    } catch (error) {
      console.log(error);
    }
  }

  const getUsers = async () => {
    try {
      const response = await axios.get(`${url}/api/admin/users`, { withCredentials: true });
      if (response.data.success) {
        setUsers(response.data.users);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const totalDiscount = rows.reduce((total, item) => total + ((item.price * item.discount) / 100), 0);

    const totalSale = orders.reduce((total, item) => total + Math.round(item.products[0].price), 0);

    setTotalSale(totalSale - totalDiscount);
  }, [rows, orders]);


  useEffect(() => {
    setTotalReviews(
      rows.reduce((total, item) => total + item.reviews.length, 0)
    );
  }, [rows])

  useEffect(() => {
    getSellerProducts();
    getSellerOrder();
    getUsers();
  }, [])


  return (
    <Box p={3}>

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
            <Typography variant="h4">{rows.length}</Typography>
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
              {totalReviews}
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* Product Table */}
      <Box mt={6}>
        <Typography variant="h5" fontWeight="bold" mb={2}>
          Pending Orders
        </Typography>
        {loading ?
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            height="70vh"
            width="100%"
          >
            <CircularProgress size={60} />
          </Box> :
          <TableContainer sx={{ maxHeight: '480px', overflowY: 'auto' }} component={Paper}>
            <Table>
              <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
                <TableRow>
                  <TableCell align='center'><strong>Image</strong></TableCell>
                  <TableCell align='center'><strong>Customer Name</strong></TableCell>
                  <TableCell align='center'><strong>Customer Number</strong></TableCell>
                  <TableCell align='center'><strong>Product Size</strong></TableCell>
                  <TableCell align='center'><strong>Original Price</strong></TableCell>
                  <TableCell align='center'><strong>Sub Category</strong></TableCell>
                  <TableCell align='center'><strong>Payment Ststus</strong></TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {orders.map((row) => row.orderStatus === 'pending' && (
                  <TableRow key={row._id} sx={{ '&:nth-of-type(even)': { backgroundColor: 'grey.100' } }}>
                    <TableCell align='center'><img src={row.products[0].image} height="50px" /></TableCell>
                    <TableCell align='center'>{row.firstName}</TableCell>
                    <TableCell align='center'>{row.phone}</TableCell>
                    <TableCell align='center'>{row.products[0].productSize}</TableCell>
                    <TableCell align='center'>{row.products[0].price}</TableCell>
                    <TableCell align='center'>{row.products[0].productId.subCategory}</TableCell>
                    <TableCell align='center'>{row.paymentStatus}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        }
      </Box>
    </Box>
  );
};

export default DashboardHome;
