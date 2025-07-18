import { Routes, Route } from "react-router-dom";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";
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
import StripeSuccess from "./mainPages/Cart/cartComponents/StripeSuccess";
import Contact from "./mainPages/Contact/index";
import ScrollToTop from "./components/ScrollUp";
import VerifyEmail from "./mainPages/Login/VerifyEmail";

import AdminLayout from "./admin";
import Dashboard from "./admin/pages/Dashboard";
import Customers from "./admin/pages/Customer";
import ProductManagement from "./admin/pages/ProductManagement";
import CategoryManagement from "./admin/pages/CategoryManagement";
import { useContext, useEffect } from "react";
import { AuthContext } from "./context/AuthContext";
import CategoryWarehouse from "./admin/pages/CategoryWarehouse";
import ProductWarehouse from "./admin/pages/ProductWarehouse";
import ForgotPassword from "./mainPages/ForgotPassword/ForgotPassword";
import ResetPassword from "./mainPages/ForgotPassword/ResetPassword";
import ReverseAuctionHome from "./mainPages/ReverseAuction/index";
import ApproveCTV from "./admin/pages/ApproveCTV";
import RegisterCTV from "./mainPages/RegisterCTV/RegisterCTV";
import OAuth2RedirectHandler from "./mainPages/Login/OAuth2RedirectHandler";
import FacebookOAuthCallback from "./mainPages/Login/FacebookOAuthCallback";
import OrdersAdmin from "./admin/pages/OrdersManagement";
import MyAuctionProduct from "./mainPages/ReverseAuction/MyAuctionProduct";
import ForumHome from "./mainPages/Forum";


function App() {
  const token = localStorage.getItem("jwtToken");
  const { logout } = useContext(AuthContext);
  useEffect(() => {
    if (!token) {
      logout();
    }
  }, [token]);

  return (
    <div className="App">
      <Header />
      <ScrollToTop />
      <div className="mainApp">

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route
            path="/admin"
            element={
              <RequiresAuth token={token}>
                <AdminLayout />
              </RequiresAuth>}
          >
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="orders" element={<OrdersAdmin />} />
            <Route path="users" element={<Customers />} />
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
            path="/payment"
            element={
              <RequiresAuth token={token}>
                <StripeSuccess />
              </RequiresAuth>
            }
          />
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
          <Route path="/oauth2/redirect" element={<OAuth2RedirectHandler />} />
          <Route path="/login/oauth2/code/facebook" element={<FacebookOAuthCallback />} />
          <Route path="/verify-email" element={<VerifyEmail />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />


        <Route path="/products/:prodID" element={<ProductDetails />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/forum" element={<ForumHome/>} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/register-ctv" element={<RegisterCTV />} />
        <Route path="/reverse-auction" element={<ReverseAuctionHome />}>
          <Route path="my" element={<MyAuctionProduct />} />
          {/* <Route path="room/:roomId" element={<AuctionChatWindow />} /> */}
        </Route>

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
