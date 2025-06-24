import "./shop.css";
import React, { useEffect, useRef, useState } from 'react';
import ProductCard from "../../components/Cards/ProductCard";
import { useData } from '../../context/DataContext';
import TuneIcon from "@mui/icons-material/Tune";
import Loader from "../../components/Loader";
import { Pagination } from "@mui/material";
import { useMemo } from 'react';


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
    const maxPrice = Math.max(...finalPriceSortedData.map(p => Number(p.price) || 0));
    function onPageChange(event, p) {
        setPage(p - 1);
    }

    const filtered = useMemo(() => {
        let temp = finalPriceSortedData;

        if (filtersUsed.categoryFilters.length > 0) {
            temp = temp.filter(product =>
                filtersUsed.categoryFilters.includes(product.categoryName)
            );
        }

        if (filtersUsed.ocassionFilters.length > 0) {
            temp = temp.filter(product =>
                filtersUsed.ocassionFilters.includes(product.occasion)
            );
        }

        if (filtersUsed.brandFilters.length > 0) {
            temp = temp.filter(product =>
                filtersUsed.brandFilters.includes(product.brand)
            );
        }

        if (filtersUsed.priceRange) {
            temp = temp.filter(product =>
                Number(product.price) <= Number(filtersUsed.priceRange)
            );
        }



        return temp;
    }, [finalPriceSortedData, filtersUsed]);

    useEffect(() => {
        if (!backendData.loading) {
            // Filter first
            const startIndex = page * resultsPerPage;
            const endIndex = startIndex + resultsPerPage;

            console.log(finalPriceSortedData)
            setData(finalPriceSortedData.slice(startIndex, endIndex));

            // Paging later
            const totalPages = Math.ceil(finalPriceSortedData.length / resultsPerPage);
          
            if (page < 0 || page >= totalPages) {
                setPage(Math.max(0, Math.min(page, totalPages - 1)));
                return;
            }

            // Scroll 
            if (productDiv.current) {
                productDiv.current.scrollIntoView();
            }
        }
    }, [filtered, backendData.loading, page, resultsPerPage]);



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
                            <input
                                type="range"
                                min="5000000"
                                max="500000000"
                                step="5000000"
                                value={filtersUsed.priceRange}
                                onChange={(e) => {
                                    setFiltersUsed({
                                        type: "PRICE",
                                        inputValue: Number(e.target.value),
                                    });
                                }}
                            />
                            <p>
                                <span>Min: 10 Tr</span>
                                <span>Max: 500 Tr</span>
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
                                onClick={() => {
                                    setFiltersUsed({
                                        type: "CLEARFILTER",
                                        inputValue: null,
                                        maxPrice,
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
                            data && data.length > 0 ? (
                                <>
                                <div className="productsContainer">
                                    {
                                        data.map((product) => (<ProductCard key={product.id} item={product} />))
                                    }
                                </div>
                                    <Pagination
                                        style={{ marginTop: 6 }}
                                        count={Math.ceil(filtered.length / resultsPerPage)}
                                        page={page + 1}
                                        onChange={onPageChange}
                                        color="primary"
                                    />
                                </>
                            ) : (<>Không có sản phẩm nào hợp với bộ lọc hiện tại</>)
                    }
                </div>
            </div>
        </div>
    );
};

export default Shop;