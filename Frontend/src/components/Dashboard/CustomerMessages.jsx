import { useEffect, useRef, useState } from 'react';
import {
  Box, Typography, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Paper, TablePagination,
  InputBase, IconButton, Toolbar, Avatar, Button
} from '@mui/material';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, List, ListItem, ListItemText
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { setMessage } from '../../redux/chatSlice';
import useRTM from '../useRTM';

const CustomerMessages = () => {
  useRTM();
  const [customers, setCustomers] = useState([]);
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [openChat, setOpenChat] = useState(false);
  const [selectedChatUser, setSelectedChatUser] = useState(null);
  const [input, setInput] = useState('');
  const { user } = useSelector(store => store.user);
  const dispatch = useDispatch();
  const { message } = useSelector(store => store.chat);

  const scrollRef = useRef();
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [message]);

  const url = 'https://e-commerce-project-6wl4.onrender.com';

  useEffect(() => {
    const result = customers?.filter(c =>
      c?.name?.toLowerCase().includes(search.toLowerCase())
    );
    setFilteredCustomers(result);
  }, [search, customers]);

  const handleChangePage = (event, newPage) => setPage(newPage);

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const getMessage = async () => {
    if (selectedChatUser) {

      try {
        const response = await axios.get(`${url}/api/message/getMessage/${selectedChatUser?.user?._id}`, { withCredentials: true });

        if (response.data.success) {
          dispatch(setMessage(response.data.data))
        }
      } catch (error) {
        console.log(error);
      }
    }
  }

  useEffect(() => {
    getMessage();
  }, [selectedChatUser])

  const handleSend = async () => {
    if (input.trim()) {
      const messageData = {
        senderId: user._id,
        receiverId: selectedChatUser.user._id,
        content: input
      };

      try {
        const res = await axios.post("https://e-commerce-project-6wl4.onrender.com/api/message/send", messageData, { withCredentials: true });

        if (res.data.success) {
          const newMessage = {
            ...res.data.data,
            sender: { ...res.data.data.sender, _id: user._id },
          };

          // Get current messages from state via useSelector
          // assuming you have `message` available here from useSelector
          const updatedMessages = [...message, newMessage];

          dispatch(setMessage(updatedMessages));

          setInput('');
        }

      } catch (err) {
        console.error("Failed to send message:", err);
      }
    }
  };

  const handleCloseChat = () => {
    setOpenChat(false);
    setSelectedChatUser(null);
  };

  const getUserWhoSendMessage = async () => {
    try {
      const response = await axios.get(`${url}/api/message/users-who-sent-messages`, { withCredentials: true });

      if (response.data.success) {
        setCustomers(response.data.data)
      }

    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    getUserWhoSendMessage()
  }, [])

  return (
    <Box sx={{ p: 1 }}>
      {/* Top Bar */}
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Typography variant="h6">Customer Messages</Typography>
        <Paper component="form" sx={{ display: 'flex', alignItems: 'center', pl: 1 }}>
          <InputBase
            placeholder="Search by name…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            sx={{ color: 'black' }}
          />
          <IconButton type="submit" onClick={e => e.preventDefault()}>
            <SearchIcon />
          </IconButton>
        </Paper>
      </Toolbar>

      {/* Table */}
      <TableContainer sx={{ mt: 2 }} component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell align='center'><strong>Profile</strong></TableCell>
              <TableCell align='center'><strong>Name</strong></TableCell>
              <TableCell align='center'><strong>Phone</strong></TableCell>
              <TableCell align='center'><strong>Last Message</strong></TableCell>
              <TableCell align='center'><strong>Date</strong></TableCell>
              <TableCell align='center'><strong>Action</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {customers && customers
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((c) => (
                <TableRow key={c.user._id}>
                  <TableCell align='center'>
                    <Avatar alt={c.name} src={c.user.profileImage} />
                  </TableCell>
                  <TableCell align='center'>{c.user.firstName}</TableCell>
                  <TableCell align='center'>{c.user.phone}</TableCell>
                  <TableCell align='center' sx={{ maxWidth: '300px' }} >{c.lastMessage}</TableCell>
                  <TableCell align='center'>
                    {new Date(c.sentAt).toLocaleDateString('en-GB', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric'
                    })}
                  </TableCell>
                  <TableCell align='center'>
                    <Button variant="outlined" size="small" onClick={() => { setOpenChat(true); setSelectedChatUser(c) }}>Chat</Button>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[5, 10]}
          component="div"
          count={filteredCustomers?.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </TableContainer>

      {/* Chat Dialog  */}
      <Dialog open={openChat} onClose={handleCloseChat} fullWidth>
        <DialogTitle>Chat with {selectedChatUser?.user.firstName}</DialogTitle>

        <DialogContent dividers sx={{ maxHeight: 500, overflowY: 'auto', backgroundColor: '#f5f5f5' }}>
          <List>
            {message && message.map((msg, index) => (
              <ListItem
                key={index}
                sx={{
                  justifyContent: msg?.sender?._id === user?._id ? 'flex-end' : 'flex-start',
                  display: 'flex'
                }}
              >
                <ListItemText
                  primary={
                    <Typography variant="body1" sx={{ whiteSpace: 'pre-line', color: msg?.sender?._id === user._id ? 'white' : 'black', }}>
                      {msg.content}
                    </Typography>
                  }
                  secondary={new Date(msg.timestamp).toLocaleDateString('en-GB', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
                  })}

                  sx={{
                    backgroundColor: msg?.sender?._id === user._id ? '#1976d2' : '#e0e0e0',
                    color: msg?.sender?._id === user._id ? 'white' : 'black',
                    borderRadius: 3,
                    px: 2,
                    py: 1,
                    maxWidth: '75%',
                    textAlign: msg?.sender?._id === user._id ? 'right' : 'left',
                  }}
                />
              </ListItem>
            ))}
            <div ref={scrollRef} />
          </List>
        </DialogContent>

        <DialogActions sx={{ px: 2, pb: 2 }}>
          <TextField
            fullWidth
            placeholder="Type your message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSend();
            }}
            variant="outlined"
            sx={{ backgroundColor: 'white', borderRadius: 2 }}
          />
          <Button onClick={handleSend} variant="contained" sx={{ ml: 1 }}>Send</Button>
        </DialogActions>
      </Dialog>

    </Box>
  );
};

export default CustomerMessages;
