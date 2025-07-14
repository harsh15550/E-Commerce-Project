import { useEffect, useState } from 'react';
import {
  Box, Typography, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Paper, TablePagination,
  InputBase,
  IconButton,
  Toolbar,
  CircularProgress
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import axios from 'axios'

const TotalSale = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [orders, setOrders] = useState([]);
  const [shippedOrder, setShippedOrder] = useState([]);
  const [searchOrder, setSearchOrder] = useState([]);
  const [loading, setLoading] = useState(true);
  const url = 'http://localhost:3000'

  const handleChangePage = (event, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };


  const getSellerProduct = async () => {
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

  useEffect(() => {
    const filter = orders.filter((item => item.orderStatus === 'shipped'))
    setShippedOrder(filter)
  }, [orders])

  useEffect(() => {
    getSellerProduct();
  }, [])

  const handleSearch = async () => {
    try {
      const response = await axios.get(`${url}/api/order/searchOrder?ordername=${searchOrder}`, { withCredentials: true });

      if (response.data.success) {
        setOrders(response.data.orders)
      }
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    handleSearch();
  }, [searchOrder])

  
  return (
    <Box sx={{ p: 1 }} >
      {/* Top Bar */}
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Typography variant="h6">Total Sale </Typography>

        <Box sx={{ display: 'flex', gap: 2 }}>
          <Paper component="form" sx={{ display: 'flex', alignItems: 'center', pl: 1 }}>
            <InputBase placeholder="Search…" value={searchOrder} onChange={(e) => setSearchOrder(e.target.value)} sx={{ color: 'black' }} size="small" />
            <IconButton type="submit">
              <SearchIcon />
            </IconButton>
          </Paper>


        </Box>
      </Toolbar>

      {/* Table */}
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
      <TableContainer sx={{ mt: 2 }} component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell align='center' ><strong>Image</strong></TableCell>
              <TableCell align='center' ><strong>Customer Name</strong></TableCell>
              <TableCell align='center' ><strong>Product Name</strong></TableCell>
              <TableCell align='center' ><strong>Sub Category</strong></TableCell>
              <TableCell align='center' ><strong>Price (₹)</strong></TableCell>
              <TableCell align='center' ><strong>Date</strong></TableCell>
              <TableCell align='center' ><strong>Payment Status</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {shippedOrder.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) =>
            (
              <TableRow key={row._id} sx={{ '&:nth-of-type(odd)': { backgroundColor: 'grey.100' } }}>
                <TableCell align='center' sx={{ width: "40px" }} >
                  <img src={row.products[0].image} height="40px" />
                </TableCell>
                <TableCell align='center' >{row.firstName}</TableCell>
                <TableCell align='center' >{row.products[0].productId.name}</TableCell>
                <TableCell align='center' >{row.products[0].productId.subCategory}</TableCell>
                <TableCell align='center' >{row.products[0].price}</TableCell>
                <TableCell align='center' >{new Date(row.createdAt).toLocaleDateString('en-GB', {
                  day: '2-digit',
                  month: 'short',
                  year: 'numeric'
                })}</TableCell>
                <TableCell align='center' sx={{ fontWeight: '600' }} >{row.paymentStatus}</TableCell>

              </TableRow>
            ))}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[5, 10]}
          component="div"
          count={shippedOrder.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </TableContainer>
}
    </Box>
  );
};

export default TotalSale;
