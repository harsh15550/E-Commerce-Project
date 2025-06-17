import { useEffect, useState } from 'react';
import {
    Box, Typography, Table, TableBody, TableCell,
    TableContainer, TableHead, TableRow, Paper, Select, MenuItem,
    TablePagination, InputBase, IconButton, Toolbar, Avatar
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import axios from 'axios';
import { toast } from 'react-toastify';
import DeleteIcon from '@mui/icons-material/Delete';

const Users = () => {
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [users, setUsers] = useState([]);
    const [searchName, setSearchName] = useState('');

    const url = 'http://localhost:3000';

    const handleChangePage = (event, newPage) => setPage(newPage);
    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };


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

    console.log(users);
    

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

    const handleSearch = async () => {

        try {
            const response = await axios.get(`${url}/api/admin/search?name=${searchName}`, { withCredentials: true });
            console.log(response);

            if (response.data.success) {
                setUsers(response.data.users)
            }
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        handleSearch();
    }, [searchName])

    useEffect(() => {
        getUsers();
    }, []);

    const handleDelete = async (id) => {
        try {
            const response = await axios.delete(`${url}/api/admin/deleteUser/${id}`, { withCredentials: true })
            if (response.data.success) {
                toast.success(response.data.message)
                const user = users.filter(user => user._id !== id);
                setUsers(user);
            }
        } catch (error) {
            toast.error(error.response.data.message);
            console.log(error);
            
        }
    }


    return (
        <Box sx={{ p: 3, width: '100%' }}>
            {/* Top Bar */}
            <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="h5" fontWeight="bold">All Users</Typography>
                <Paper component="form" sx={{ display: 'flex', alignItems: 'center', pl: 1 }}>
                    <InputBase
                        placeholder="Search by name..."
                        value={searchName}
                        onChange={(e) => setSearchName(e.target.value)}
                        sx={{ color: 'black' }}
                        size="small"
                    />
                    <IconButton type="submit"><SearchIcon /></IconButton>
                </Paper>
            </Toolbar>

            {/* Table */}
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
                            <TableCell align="center"><strong>Action</strong></TableCell>
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
                                    <TableCell align="center" sx={{ maxWidth: 100, minWidth: 100, }} >{row.gstNumber || row.role === 'seller' && '—'}</TableCell>
                                    <TableCell align="center" sx={{ maxWidth: 100, minWidth: 100, }}>{row.storeName || row.role === 'seller' && '—'}</TableCell>
                                    <TableCell
                                        align="center"
                                        sx={{
                                            maxWidth: 290,
                                            minWidth: 290,
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
                                    {row.role === 'seller' ?
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
                                        </TableCell> : <TableCell>{null}</TableCell> 
                                    }
                                    <TableCell align='center' >
                                        <IconButton onClick={() => handleDelete(row._id)} color="error">
                                            <DeleteIcon />
                                        </IconButton>
                                    </TableCell>
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
    );
};

export default Users;
