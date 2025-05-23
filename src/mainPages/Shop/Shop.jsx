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
                      <input type="range"
                      min="5000000"
                      max="500000000"
                      step="5000000" 
                      value={filtersUsed.priceRange}
                      onChange={(e) => {
                        setFiltersUsed({
                          type: "PRICE",
                          inputValue: e.target.value,
                        });
                      }}/>
                      <p>
                          <span>Min: 5,000,000</span>
                          <span>Max: 500,000,000</span>
                      </p>
                  </div>
                  <div>
                      <h3>Danh mục</h3>
                      {
                        categoriesData && categoriesData.map(category => (
                        <label key={category.id}>
                            <input 
                                type="checkbox"
                                name={category.name}
                                checked={filtersUsed.categoryFilters.includes(category.name)}
                                value={category.name}
                                onClick={(e) => {
                                    setFiltersUsed({
                                    type: "CATEGORY",
                                    inputValue: e.target.value,
                                    });
                                }}
                            />
                            {category.name}
                        </label>))
                      }
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
                      Đã tìm thấy <span className="text-blue-600">{productCount}</span> sản phẩm
                  </div>
                  <div className="productsContainer">
                      {finalPriceSortedData.map((product) => (
                          <ProductCard key={product.id} item={product}/>
                      ))}
                  </div>
              </div>
          </div>
      </div>
  );
};

export default Shop;