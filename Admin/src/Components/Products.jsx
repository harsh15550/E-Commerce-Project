import { useEffect, useState } from 'react';
import {
  Box, Button, IconButton, InputBase, MenuItem, Paper,
  Select, Table, TableBody, TableCell, TableContainer, TableHead,
  TablePagination, TableRow, TableSortLabel, Toolbar, Typography, 
} from '@mui/material';
import { Link } from 'react-router-dom';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import axios from 'axios';
import { toast } from 'react-toastify';
import EditProductPage from './EditProduct';


const headCells = [
  { id: 'image', label: 'Image' },
  { id: 'name', label: 'Name' },
  { id: 'main_category', label: 'Main Category' },
  { id: 'sub_category', label: 'Sub Category' },
  { id: 'price', label: 'Price' },
  { id: 'discount', label: 'Discount' },
  { id: 'stock', label: 'Product Stock' },
  { id: 'action', label: 'Action' }, // New Action column
];

const Products = () => {
  const url = 'http://localhost:3000';

  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('name');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [editDialog, setEditDialog] = useState(false);
  const [rows, setRows] = useState([]);
  const [selectProduct, setSelectProduct] = useState({});
  const [searchProduct, setSearchProduct] = useState('');

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleDelete = async (id) => {
    try {
      const response = await axios.delete(`${url}/api/product/deleteProduct/${id}`, { withCredentials: true });
      if (response.data.success) {
        const updatedProducts = rows.filter((product) => product._id !== id)
        setRows(updatedProducts)
        toast.success(response.data.message);
      }
      console.log(response);

    } catch (error) {
      console.log(error);

    }
  };

  const getSellerProducts = async () => {
    try {
      const response = await axios.get(`${url}/api/admin/product`, { withCredentials: true });
      console.log(response);
      
      if (response.data.success) {
        setRows(response.data.products)
      }
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    getSellerProducts();
  }, [])


  const handleSortOption = (option) => {
    let filteredProducts = [...rows];
    if (option === 'Ascending') {
      filteredProducts.sort((a, b) => a.price - b.price);
    } else if (option === 'Descending') {
      filteredProducts.sort((a, b) => b.price - a.price);
    }  
    setRows(filteredProducts)
  };

  const handleSearch = async () => {
        
        try {
            const response = await axios.get(`${url}/api/admin/search?name=${searchProduct}`, { withCredentials: true });
            console.log(response);
            
            if (response.data.success) {
                setRows(response.data.products)
            }
        } catch (error) {
            console.log(error);
        }
    }
  
    useEffect(() => {
      handleSearch();
    }, [searchProduct])
  

  return (
    <Box sx={{ p: 3, width:'105%' }}>
      {/* Toolbar */}
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Typography variant="h6">Products</Typography>

        <Box sx={{ display: 'flex', gap: 2 }}>
          <Paper component="form" sx={{ display: 'flex', alignItems: 'center', pl: 1 }}>
            <InputBase placeholder="Search…" value={searchProduct} onChange={(e) => setSearchProduct(e.target.value)} sx={{ color: 'black' }} size="small" />
            <IconButton type="submit">
              <SearchIcon />
            </IconButton>
          </Paper>
          <Select defaultValue="latest" size="small">
            <MenuItem value="latest">Sort by Price</MenuItem>
            <MenuItem value="priceHigh" onClick={() => handleSortOption('Descending')}>Price: High to Low</MenuItem>
            <MenuItem value="priceLow" onClick={() => handleSortOption('Ascending')}>Price: Low to High</MenuItem>
          </Select>
          <Link to={'/addproduct'} >
            <Button variant="contained" startIcon={<AddIcon />}>
              Add New
            </Button>
          </Link>
        </Box>
      </Toolbar>

      {/* Table */}
      <TableContainer sx={{ mt: '20px' }} >
        <Table>
          <TableHead>
            <TableRow>
              {headCells.map((headCell) => (
                <TableCell
                  align='center'
                  key={headCell.id}
                  sortDirection={orderBy === headCell.id ? order : false}
                >
                  <TableSortLabel
                    active={orderBy === headCell.id}
                    direction={orderBy === headCell.id ? order : 'asc'}
                    onClick={(e) => handleRequestSort(e, headCell.id)}
                  >
                    <strong>
                      {headCell.label}
                    </strong>
                  </TableSortLabel>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row) => {
                return (
                  <TableRow
                    key={order._id} sx={{ '&:nth-of-type(odd)': { backgroundColor: 'grey.100' } }}
                  >
                    <TableCell align='center' >
                      <img src={row.productimgs[0]} height="40px" />
                    </TableCell>
                    <TableCell align='center' sx={{width:'150px'}} >{row.name}</TableCell>
                    <TableCell align='center' >{row.mainCategory}</TableCell>
                    <TableCell align='center' >{row.subCategory}</TableCell>
                    <TableCell align='center' >₹{row.price}</TableCell>
                    <TableCell align='center' >{row.discount}%</TableCell>
                    <TableCell align='center' >{row.stock}</TableCell>
                    <TableCell align='center' >
                      <IconButton onClick={() => { setEditDialog(true); setSelectProduct(row); }} color="primary">
                        <EditIcon />
                      </IconButton>
                      <IconButton onClick={() => handleDelete(row._id)} color="error">
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination */}
      <TablePagination
        rowsPerPageOptions={[5, 10, 20]}
        component="div"
        count={rows.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />

      {/* Edit Product Dialog  */}

      <EditProductPage editDialog={editDialog} setRows={setRows} rows={rows} setEditDialog={setEditDialog} selectProduct={selectProduct} setSelectProduct={setSelectProduct} />

    </Box>
  );
};

export default Products;