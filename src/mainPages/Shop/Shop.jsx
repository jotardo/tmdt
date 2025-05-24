import React, { useEffect, useState } from 'react';
import { getAllProducts } from '../../services/shopingService/shopService';
import ProductCard from "../../components/Cards/ProductCard";
import "./shop.css";
import { useData } from '../../context/DataContext';
const Shop = () => {
  const {
    backendData,    // full product list
    finalPriceSortedData,   // full sorted product data
    productCount,   // total product count
    setFiltersUsed, // update filter data function
    filtersUsed,    // get filter data
    categoriesData, // get categories
  } = useData();

  const [showFilters, setShowFilters] = useState(true);
  

    return (
        <div className="allProductsContainer">
            <div className="main">
                <aside>
                    <div className="filterHeader">
                        <h3>BỘ LỌC</h3>
                    </div>
                    <div className="priceFilter">
                        <h3>Giá cả</h3>
                        <input type="range" min="0" max="10000000"/>
                        <p>
                            <span>Min: 0</span>
                            <span>Max: 10,000,000</span>
                        </p>
                    </div>
                    <div>
                        <h3>Danh mục</h3>
                        <label><input type="checkbox"/> Dây chuyền</label>
                        <label><input type="checkbox"/> Nhẫn </label>
                        <label><input type="checkbox"/> Vòng tay</label>
                    </div>
                    <div>
                        <h3>Dịp</h3>
                        <label><input type="checkbox"/> Trang trọng</label>
                        <label><input type="checkbox"/> Đời thường </label>
                        <label><input type="checkbox"/> Lễ tiệc</label>
                    </div>
                </aside>
                <div className="productsContentArea">
                    <div className="mb-4 text-gray-700 text-lg font-semibold">
                        Đã tìm thấy <span className="text-blue-600">{products.length}</span> sản phẩm
                    </div>
                    <div className="productsContainer">
                        {loading ? (
                            <p>Đang tải sản phẩm...</p>
                        ) : (
                            Array.isArray(products) && products.length > 0 ? (
                                products.map((product) => (
                                    <ProductCard key={product.id} item={product}/>
                                ))
                            ) : (
                                <p>Không tìm thấy sản phẩm nào.</p>
                            )
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Shop;