import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import "react-inner-image-zoom/lib/InnerImageZoom/styles.css";

import AuthProvider from "./context/AuthContext";
import { useData, DataProvider } from "./context/DataContext";
import { useWish, WishProvider } from "./context/WishListContext";
import { useCart, CartProvider } from "./context/CartContext";
import { useAddress, AddressProvider } from "./context/AddressContext";

export { useData, useWish, useCart, useAddress };

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
    <React.StrictMode>
      <BrowserRouter
          future={{
            v7_startTransition: true,
            v7_relativeSplatPath: true,
          }}
      >
        <AuthProvider>
          <DataProvider>
            <CartProvider>
              <AddressProvider>
                <WishProvider>
                  <App />
                </WishProvider>
              </AddressProvider>
            </CartProvider>
          </DataProvider>
        </AuthProvider>
      </BrowserRouter>
    </React.StrictMode>
);
