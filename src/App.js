import { Routes, Route } from "react-router-dom";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";
// import MockApi from "./components/MockMan";
import RequiresAuth from "./components/RequiresAuth";

import Header from "./components/Header";
import About from "./mainPages/About/index";
import Home from "./mainPages/Home/index";
import Cart from "./mainPages/Cart/index";
import Profile from "./mainPages/Profile/index";
import Shop from "./mainPages/Shop/Shop";
import Login from "./mainPages/Login/index";
import Footer from "./components/Footer";
import ProductDetails from "./mainPages/ProductDetails/index";
import WishList from "./mainPages/WishList/index";
import Error from "./mainPages/Error";
import Orders from "./mainPages/Profile/components/Orders";
import Address from "./mainPages/Profile/components/Address";
import User from "./mainPages/Profile/components/User";
import CheckoutDetails from "./mainPages/Cart/cartComponents/CheckoutDetails";
import ShoppingCart from "./mainPages/Cart/cartComponents/ShoppingCart";
import OrderComplete from "./mainPages/Cart/cartComponents/OrdersComplete";
import Contact from "./mainPages/Contact/index";
import ScrollToTop from "./components/ScrollUp";
import VerifyEmail from "./mainPages/Login/VerifyEmail";

import AdminLayout from "./admin";
import Dashboard from "./admin/pages/Dashboard";
import Customers from "./admin/pages/Customer";
import OrdersAdmin from "./admin/pages/Orders";
import ProductManagement from "./admin/pages/ProductManagement";
import CategoryManagement from "./admin/pages/CategoryManagement";
import { useContext, useEffect } from "react";
import { AuthContext } from "./context/AuthContext";
import CategoryWarehouse from "./admin/pages/CategoryWarehouse";
import ProductWarehouse from "./admin/pages/ProductWarehouse";
import ForgotPassword from "./mainPages/ForgotPassword/ForgotPassword";
import ResetPassword from "./mainPages/ForgotPassword/ResetPassword";
import ApproveCTV from "./admin/pages/ApproveCTV";
import RegisterCTV from "./mainPages/RegisterCTV/RegisterCTV";


function App() {
  const token = localStorage.getItem("jwtToken");
  const { logout } = useContext(AuthContext);
  // useEffect(() => {
  //  logout();
  // }, [])
  return (
    <div className="App">
      <Header />
      <ScrollToTop />
      <div className="mainApp">
      <Routes>
        <Route path="/" element={<Home />} />
        {/* <Route path="/mockman" element={<MockApi />} /> */}
        <Route path="/about" element={<About />} />
        <Route
          path="/admin"
          element={
              <AdminLayout />
          }
        >
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="orders" element={<Orders />} />
          <Route path="users" element={<Customers/>} />
          <Route path="products" element={<ProductManagement />} />
          <Route path="categories" element={<CategoryManagement />} />
          <Route path="category-warehouse" element={<CategoryWarehouse />} />
          <Route path="product-warehouse" element={<ProductWarehouse />} />
          <Route path="approve-ctv" element={<ApproveCTV />} />
        </Route>
        <Route
          path="/cart"
          element={
            <RequiresAuth token={token}>
              {" "}
              <Cart />
            </RequiresAuth>
          }
        >
          <Route path="" element={<ShoppingCart />} />
          <Route path="completedorders" element={<OrderComplete />} />
          <Route path="checkout" element={<CheckoutDetails />} />
        </Route>

        <Route
          path="/wishlist"
          element={
            <RequiresAuth token={token}>
              <WishList />
            </RequiresAuth>
          }
        />

        <Route
          path="/profile"
          element={
            <RequiresAuth token={token}>
              <Profile />
            </RequiresAuth>
          }
        >
          <Route path="" element={<User />} />
          <Route path="orders" element={<Orders />} />
          <Route path="address" element={<Address />} />
        </Route>
        <Route path="/login" element={<Login />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        {/* <Route path="/register" element={<Register />} /> */}
        <Route path="/products/:prodID" element={<ProductDetails />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/register-ctv" element={<RegisterCTV />} />
        <Route path="*" element={<Error />} />

      </Routes>
      <ToastContainer
        position="bottom-right"
        autoClose={1200}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      </div>
      <Footer />
    </div>
  );
}

export default App;
