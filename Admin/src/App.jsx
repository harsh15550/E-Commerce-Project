import Login from './Components/Login';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { Box, Grid } from '@mui/material'; 
import Navbar from './Components/Navbar';
import Orders from './Components/Orders';
import Products from './Components/Products';
import LeftSidebar from './Components/LeftSidebar'; 
import Reviews from './Components/Reviews';
import DashboardHome from './Components/DashboardHome';
import TotalSale from './Components/TotalSale';
import Users from './Components/Users';
import AddProduct from './Components/AddProduct';
import {useSelector} from 'react-redux';
const AppLayout = () => {
  const {admin} = useSelector(store => store.user);
  console.log(admin);
  

  // If on login page, only show login
  if (!admin) {
    return (
      <>
        <ToastContainer
          position="bottom-center"
          theme="dark"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={true}
          closeOnClick
          pauseOnHover
          draggable
        />
        <Login />
      </>
    );
  }

  // For other pages, show full layout
  return (
    <>
      <ToastContainer
        position="bottom-center"
        theme="dark"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick
        pauseOnHover
        draggable
      />
      <Navbar />
      <Grid container>
        <Grid item>
          <LeftSidebar />
        </Grid>
        <Grid item xs>
          <Routes>
            <Route path="/" element={<DashboardHome />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/products" element={<Products />} />
            <Route path="/reviews" element={<Reviews />} />
            <Route path="/totalsale" element={<TotalSale />} />
            <Route path="/users" element={<Users />} />
            <Route path="/addproduct" element={<AddProduct />} />
          </Routes>
        </Grid>
      </Grid>
    </>
  );
};

const App = () => (
  <Router>
    <AppLayout />
  </Router>
);

export default App;
