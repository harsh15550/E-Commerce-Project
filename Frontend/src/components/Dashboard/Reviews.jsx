import React, { useEffect, useState } from 'react';
import {
  Box, Typography, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, TablePagination, Toolbar,
  Rating,
  Select,
  MenuItem,
  CircularProgress
} from '@mui/material';
import axios from 'axios';

const Reviews = () => {
  const [reviews, setReviews] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [loading, setLoading] = useState(true);

  const handleChangePage = (event, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  const url = 'https://e-commerce-project-6wl4.onrender.com';
  const handleGetReview = async () => {
    try {
      const response = await axios.get(`${url}/api/product/getReview`, { withCredentials: true });
      if (response.data.success) {
        setReviews(response.data.reviews);
        setLoading(false);
      }
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    handleGetReview();
  }, [])

  const handleSortOption = (option) => {
    let filteredReviews = [...reviews];
    if (option === 'Ascending') {
      filteredReviews.sort((a, b) => a.rating - b.rating);
    } else if (option === 'Descending') {
      filteredReviews.sort((a, b) => b.rating - a.rating);
    }  
    setReviews(filteredReviews)
  };

  return (
    <Box sx={{ p: 1 }}>
      {/* Top Bar */}
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Typography variant="h6">Reviews</Typography>

          <Select defaultValue="latest" size="small">
            <MenuItem value="latest">Sort by Star</MenuItem>
            <MenuItem value="priceHigh" onClick={() => handleSortOption('Descending')}>Star : High to Low</MenuItem>
            <MenuItem value="priceLow" onClick={() => handleSortOption('Ascending')}>Star : Low to High</MenuItem>
          </Select>
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
              <TableCell align="center"><strong>Product Img</strong></TableCell>
              <TableCell align="center"><strong>User</strong></TableCell>
              <TableCell align="center"><strong>Product</strong></TableCell>
              <TableCell align="center"><strong>Rating</strong></TableCell>
              <TableCell align="center"><strong>Comment</strong></TableCell>
              <TableCell align="center"><strong>Date</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {reviews.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((review) => (
              <TableRow key={review._id} sx={{ '&:nth-of-type(odd)': { backgroundColor: 'grey.100' } }}>
                <TableCell align="center" maxWidth={'40px'}>
                  <img
                    src={review?.productId?.productimgs[0]}
                    style={{ height: '40px', objectFit: 'cover' }}
                    alt="product"
                  />
                </TableCell>

                <TableCell align="center">
                  <Box display="flex" alignItems="center" gap={1}>
                    <Typography>{review?.userId?.firstName}</Typography>
                  </Box>
                </TableCell>
                <TableCell align="center">{review?.productId?.name}</TableCell>
                <TableCell align="center">
                  <Rating value={review.rating} readOnly size="small" />
                </TableCell>
                <TableCell align="center" sx={{ maxWidth: '500px' }} >{review?.comment}</TableCell>
                <TableCell align="center">
                  {new Date(review?.createdAt).toLocaleDateString('en-GB', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric'
                  })}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[5, 10]}
          component="div"
          count={reviews.length}
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

export default Reviews;
