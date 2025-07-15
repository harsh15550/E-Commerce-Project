import Signup from "./components/Signup";
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import Login from "./components/Login";
import Home from "./components/Home";
import Navbar from "./components/Navbar";
import { Box } from "@mui/material";
import Footer from "./components/Footer";
import ProductsPage from "./components/ProductsPage";
import Profile from "./components/Profile";
import ProductDetail from "./components/ProductDetail";
import DashboardPage from "./components/Dashboard/DashboardPage";
import MyProducts from "./components/Dashboard/MyProducts";
import Orders from "./components/Dashboard/Orders";
import TotalSale from "./components/Dashboard/TotalSale";
import Reviews from "./components/Dashboard/Reviews";
import DashboardHome from "./components/Dashboard/DashboardHome";
import AboutPage from "./components/AboutPage ";
import ContactPage from "./components/ContactPage";
import AddProduct from "./components/Dashboard/AddProduct";
import Favorites from "./components/Favorites";
import CheckoutPage from "./components/Checkout";
import MyOrders from "./components/MyOrders";
import { ProtectedRoute, PublicRoute, SellerProtectedRoute } from "./components/ProtectedRoute";
import CustomerMessages from "./components/Dashboard/CustomerMessages";
import { useEffect, useState } from "react";
import io from "socket.io-client";
import { useDispatch, useSelector } from "react-redux";
import { setSocket } from "./redux/socketSlice";
import FancyLoader from "./components/FancyLoader";
import ForgotPassword from "./components/ForgotPassword";
import axios from "axios";
import { setAllProducts } from "./redux/productSlice";

function App() {
  const location = useLocation();
  const hideNavFooter = location.pathname === "/login" || location.pathname === "/signup" || location.pathname === "/forgot-password";
  const { user } = useSelector((state) => state.user);
  // const socket = useSelector((state) => state.socket.socket);
  const [showLoader, setShowLoader] = useState(true);
  const dispatch = useDispatch();
  const userId = user?._id;
  // const { allProduct } = useSelector(store => store.products);
  const [allProduct, setAllProduct] = useState([]);


  useEffect(() => {
    if (!userId) return; // Wait until userId is available

    const newSocket = io("https://e-commerce-project-6wl4.onrender.com", {
      query: { userId },
    });

    dispatch(setSocket(newSocket));

    return () => {
      newSocket.disconnect();
    };
  }, [])

  const getAllProduct = async () => {
    try {
      const response = await axios.get(`https://e-commerce-project-6wl4.onrender.com/api/product/getAllProduct`);
      if (response.data.success) {
        dispatch(setAllProducts(response.data.products));
        setAllProduct(response.data.products);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getAllProduct()
  }, [])

  useEffect(() => {
  if (Array.isArray(allProduct)) {
    setShowLoader(false); // Even if product is empty, we stop loader
  }
}, [allProduct]);


  if (!user && (allProduct.length === 0)) {
    return (
      <Box>
        <Routes>
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="*" element={<Login />} />
        </Routes>
      </Box>
    );
  }

  if (showLoader) {
    return <Box><FancyLoader message="Fetching awesome products..." /></Box>;
  }

  return (
    <Box>
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
      {!hideNavFooter && <Navbar />}
      <Routes>
        {/* Public Routes (accessible only when not logged in) */}
        <Route path="/signup" element={<PublicRoute><Signup /></PublicRoute>} />
        <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
        <Route path="/forgot-password" element={<PublicRoute><ForgotPassword /></PublicRoute>} />

        {/* Protected Routes (only accessible when logged in) */}
        <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
        <Route path="/product" element={<ProtectedRoute><ProductsPage /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="/productDetail/:id" element={<ProtectedRoute><ProductDetail /></ProtectedRoute>} />
        <Route path="/about" element={<ProtectedRoute><AboutPage /></ProtectedRoute>} />
        <Route path="/contact" element={<ProtectedRoute><ContactPage /></ProtectedRoute>} />
        <Route path="/checkout" element={<ProtectedRoute><CheckoutPage /></ProtectedRoute>} />
        <Route path="/favorites" element={<ProtectedRoute><Favorites /></ProtectedRoute>} />
        <Route path="/myorders" element={<ProtectedRoute><MyOrders /></ProtectedRoute>} />

        {/* Nested Dashboard Protected Routes */}
        <Route path="/dashboard" element={<SellerProtectedRoute><DashboardPage /></SellerProtectedRoute>}>
          <Route path="home" index element={<DashboardHome />} />
          <Route path="products" element={<MyProducts />} />
          <Route path="addproduct" element={<AddProduct />} />
          <Route path="orders" element={<Orders />} />
          <Route path="reviews" element={<Reviews />} />
          <Route path="totalsale" element={<TotalSale />} />
          <Route path="messages" element={<CustomerMessages />} />
        </Route>
      </Routes>
      {!hideNavFooter && <Footer />}
    </Box>
  );
}

export default App;
