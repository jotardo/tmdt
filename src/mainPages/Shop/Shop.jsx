import "./shop.css";
import React, { useEffect, useRef, useState } from 'react';
import ProductCard from "../../components/Cards/ProductCard";
import { useData } from '../../context/DataContext';
import TuneIcon from "@mui/icons-material/Tune";
import Loader from "../../components/Loader";
import { Pagination } from "@mui/material";
const Shop = () => {
    const {
        backendData,    // full product list
        finalPriceSortedData,   // full sorted product data
        productCount,   // total product count
        setFiltersUsed, // update filter data function
        filtersUsed,    // get filter data
        categoriesData, // get categories
        brandData,      // get brands
        occasionData,      // get occasions
    } = useData();

    const resultsPerPage = 24;
    const [page, setPage] = useState(0);
    const [data, setData] = useState([]);
    const [showFilters, setShowFilters] = useState(true);
    const productDiv = useRef(null);
    // pagination change control
    function onPageChange(event, p) {
        setPage(p - 1);
    }

    // yipee
    useEffect(() => {
        if (!backendData.loading) {
            const totalPages = Math.ceil(finalPriceSortedData.length / resultsPerPage);
            if (page < 0 || page >= totalPages) {
                setPage(Math.max(0, Math.min(page, totalPages - 1)));
                return;
            }

            const startIndex = page * resultsPerPage;
            const endIndex = startIndex + resultsPerPage;
            setData(finalPriceSortedData.slice(startIndex, endIndex));

            if (productDiv.current) {
                productDiv.current.scrollIntoView();
            }
        }
    }, [finalPriceSortedData, page, resultsPerPage]);


    return (
        <div className="allProductsContainer" ref={productDiv}>
            <div className="main">
                <button
                    className="showFiltersBtn"
                    onClick={() => {
                        setShowFilters(!showFilters);
                    }}
                >
                    {showFilters ? "Ẩn" : "Hiện"}
                    <TuneIcon />
                </button>
                <div className="mb-4 text-gray-700 text-lg font-semibold">
                    Đã tìm thấy <span className="text-blue-600">{productCount}</span> sản phẩm
                </div>
                <div className="allFilters">
                    <aside
                        style={!showFilters ? { display: "none" } : {}}
                        className={!showFilters ? "allFilters " : "mobileViewFilter"}>
                        <div>Query string: {filtersUsed.search}</div>
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
                                }} />
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
                                            onChange={(e) => {
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
                            {
                                occasionData && occasionData.map((occasionName, index) => (
                                    <label key={index}>
                                        <input
                                            type="checkbox"
                                            name={occasionName}
                                            checked={filtersUsed.ocassionFilters.includes(occasionName)}
                                            value={occasionName}
                                            onChange={(e) => {
                                                setFiltersUsed({
                                                    type: "OCCASION",
                                                    inputValue: e.target.value,
                                                });
                                            }}
                                        />
                                        {occasionName}
                                    </label>))
                            }
                        </div>
                        <div>
                            <h3>Thương hiệu</h3>
                            {
                                brandData && brandData.map((brand, index) => (
                                    <label key={index}>
                                        <input
                                            type="checkbox"
                                            name={brand}
                                            checked={filtersUsed.brandFilters.includes(brand)}
                                            value={brand}
                                            onChange={(e) => {
                                                setFiltersUsed({
                                                    type: "BRAND",
                                                    inputValue: e.target.value,
                                                });
                                            }}
                                        />
                                        {brand}
                                    </label>))
                            }
                        </div>
                        <div className="clearAll">
                            <button
                                onClick={(e) => {
                                    setFiltersUsed({
                                        type: "CLEARFILTER",
                                        inputValue: e.target.value,
                                    });
                                }}
                            >
                                Xóa bộ lọc
                            </button>
                        </div>
                    </aside>

                </div>
                <div className="displayProducts">
                    {
                        backendData?.loading ? (<h3><Loader /></h3>) : backendData?.error ? (
                            <h3>Hiện tại dữ liệu có vấn đề</h3>
                        ) :
                            (
                                <>
                                <div className="productsContainer">
                                    {
                                        data.map((product) => (<ProductCard key={product.id} item={product} />))
                                    }
                                </div>
                                    <Pagination
                                        style={{marginTop: 6}}
                                        count={Math.ceil(finalPriceSortedData.length / resultsPerPage)}
                                        page={page + 1}
                                        onChange={onPageChange}
                                        color="primary"
                                    />
                                </>
                            )
                    }
                </div>
            </div>
        </div>
    );
};

export default Shop;