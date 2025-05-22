import "./shop.css";
import { useState, useEffect } from "react";
import TuneIcon from "@mui/icons-material/Tune";
import Loader from "../../components/Loader";
import { useData } from "../../context/DataContext";
import ProductCard from "../../components/ProductCard";
export default function Shop() {
  const {
    backendData,
    finalPriceSortedData,
    productCount,
    setFiltersUsed,
    filtersUsed,
  } = useData();
  const [showFilters, setShowFilters] = useState(true);

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth",
    });
  }, []);

  return (
    <>
      <div className="allProductsContainer">
        <p>
          Số sản phẩm tìm thấy : <b> {productCount}</b>
        </p>
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
          <div className="allFilters">
            {
              <aside
                style={!showFilters ? { display: "none" } : {}}
                className={!showFilters ? "allFilters " : "mobileViewFilter"}
              >
                <div className="filterHeader">
                  <h3>Bộ lọc</h3>
                </div>
                <div className="priceFilter">
                  <h3>Giá cả</h3>
                  <p>
                    <span>12Tr940K</span>
                    <span>38Tr820K</span>
                    {/*<span>500</span>*/}
                    {/*<span>1500</span>*/}
                  </p>
                  <input
                      type="range"
                      name="priceRange"
                      id="priceRange"
                      // step="100"
                      step="2588000.00"
                      value={filtersUsed.priceRange}
                      min={12940000.00}
                      max={38820000.00}
                      // min={500}
                      // max={1500}
                      onChange={(e) => {
                        setFiltersUsed({
                          type: "PRICE",
                          inputValue: e.target.value,
                        });
                      }}
                  />
                  <p>
                    <span style={{ visibility: "hidden" }}>.</span> {/* Placeholder để căn giữa */}
                    <span>25Tr880K</span>
                    {/*<span>1000</span>*/}
                    <span style={{ visibility: "hidden" }}>.</span> {/* Placeholder để căn giữa */}
                  </p>
                </div>
                <div className="categoryFilter">
                  <h3>Danh mục</h3>
                  <label htmlFor="necklace">
                    <input
                        type="checkbox"
                        checked={filtersUsed.categoryFilters.includes("Dây chuyền")}
                        name="category"
                      id="necklace"
                      value="Dây chuyền"
                      onClick={(e) => {
                        setFiltersUsed({
                          type: "CATEGORY",
                          inputValue: e.target.value,
                        });
                      }}
                    />
                    Dây chuyền
                  </label>

                  <label htmlFor="ring">
                    <input
                      type="checkbox"
                      checked={filtersUsed.categoryFilters.includes("Nhẫn")}
                      name="category"
                      id="ring"
                      value="Nhẫn"
                      onClick={(e) => {
                        setFiltersUsed({
                          type: "CATEGORY",
                          inputValue: e.target.value,
                        });
                      }}
                    />
                    Nhẫn
                  </label>

                  <label htmlFor="bracelet">
                    <input
                      type="checkbox"
                      checked={filtersUsed.categoryFilters.includes("Vòng tay")}
                      name="category"
                      id="bracelet"
                      value="Vòng tay"
                      onClick={(e) => {
                        setFiltersUsed({
                          type: "CATEGORY",
                          inputValue: e.target.value,
                        });
                      }}
                    />
                    Vòng tay
                  </label>
                  <label htmlFor="earring">
                    <input
                      type="checkbox"
                      checked={filtersUsed.categoryFilters.includes("Bông tai")}
                      name="category"
                      id="earring"
                      value="Bông tai"
                      onClick={(e) => {
                        setFiltersUsed({
                          type: "CATEGORY",
                          inputValue: e.target.value,
                        });
                      }}
                    />
                    Bông tai
                  </label>
                </div>
                <div className="ocassionFilter">
                  <h3>Nhu cầu</h3>
                  <label htmlFor="office">
                    <input
                      type="checkbox"
                      checked={filtersUsed.ocassionFilters.includes("Office")}
                      name="office"
                      id="office"
                      value="Office"
                      onClick={(e) => {
                        setFiltersUsed({
                          type: "OCCASION",
                          inputValue: e.target.value,
                        });
                      }}
                    />
                    Văn phòng
                  </label>
                  <label htmlFor="casual">
                    <input
                      type="checkbox"
                      checked={filtersUsed.ocassionFilters.includes("Casual")}
                      name="casual"
                      id="casual"
                      value="Casual"
                      onClick={(e) => {
                        setFiltersUsed({
                          type: "OCCASION",
                          inputValue: e.target.value,
                        });
                      }}
                    />
                    Thường lệ
                  </label>
                  <label htmlFor="engagement">
                    <input
                      type="checkbox"
                      checked={filtersUsed.ocassionFilters.includes(
                        "Engagement"
                      )}
                      name="engagement"
                      id="engagement"
                      value="Engagement"
                      onClick={(e) => {
                        setFiltersUsed({
                          type: "OCCASION",
                          inputValue: e.target.value,
                        });
                      }}
                    />
                    Đính hôn
                  </label>
                  <label htmlFor="bridal">
                    <input
                      type="checkbox"
                      checked={filtersUsed.ocassionFilters.includes("Bridal")}
                      name="bridal"
                      id="bridal"
                      value="Bridal"
                      onClick={(e) => {
                        setFiltersUsed({
                          type: "OCCASION",
                          inputValue: e.target.value,
                        });
                      }}
                    />
                    Cưới hỏi
                  </label>
                </div>
                <div className="typeOfMetal">
                  <h3>Loại Đá</h3>
                  <label htmlFor="diamond">
                    <input
                      type="checkbox"
                      checked={filtersUsed.materialFilter.includes("diamond")}
                      name="diamond"
                      id="diamond"
                      value="diamond"
                      onClick={(e) => {
                        setFiltersUsed({
                          type: "MATERIAL",
                          inputValue: e.target.value,
                        });
                      }}
                    />
                    Kim cương
                  </label>
                  <label htmlFor="platinum">
                    <input
                      type="checkbox"
                      checked={filtersUsed.materialFilter.includes("platinum")}
                      name="platinum"
                      id="platinum"
                      value="platinum"
                      onClick={(e) => {
                        setFiltersUsed({
                          type: "MATERIAL",
                          inputValue: e.target.value,
                        });
                      }}
                    />
                    Platinum
                  </label>
                  <label htmlFor="gold">
                    <input
                      type="checkbox"
                      checked={filtersUsed.materialFilter.includes("gold")}
                      name="gold"
                      id="gold"
                      value="gold"
                      onClick={(e) => {
                        setFiltersUsed({
                          type: "MATERIAL",
                          inputValue: e.target.value,
                        });
                      }}
                    />
                    Vàng
                  </label>
                  <label htmlFor="silver">
                    <input
                      type="checkbox"
                      checked={filtersUsed.materialFilter.includes("silver")}
                      name="silver"
                      id="silver"
                      value="silver"
                      onClick={(e) => {
                        setFiltersUsed({
                          type: "MATERIAL",
                          inputValue: e.target.value,
                        });
                      }}
                    />
                    Bạc
                  </label>
                </div>
                <div className="ratingFilter">
                  <h3>Đánh giá </h3>
                  <label htmlFor="onePlus">
                    <input
                      type="radio"
                      name="rating"
                      id="onePlus"
                      value={1}
                      checked={filtersUsed.rating === "1"}
                      onClick={(e) => {
                        setFiltersUsed({
                          type: "RATINGS",
                          inputValue: e.target.value,
                        });
                      }}
                    />
                    1 ⭐ & above
                  </label>
                  <label htmlFor="twoPlus">
                    <input
                      type="radio"
                      name="rating"
                      id="twoPlus"
                      checked={filtersUsed.rating === "2"}
                      value={2}
                      onClick={(e) => {
                        setFiltersUsed({
                          type: "RATINGS",
                          inputValue: e.target.value,
                        });
                      }}
                    />
                    2 ⭐ & above
                  </label>
                  <label htmlFor="threePlus">
                    <input
                      type="radio"
                      name="rating"
                      id="threePlus"
                      checked={filtersUsed.rating === "3"}
                      value={3}
                      onClick={(e) => {
                        setFiltersUsed({
                          type: "RATINGS",
                          inputValue: e.target.value,
                        });
                      }}
                    />
                    3 ⭐ & above
                  </label>
                  <label htmlFor="fourPlus">
                    <input
                      type="radio"
                      name="rating"
                      id="fourPlus"
                      checked={filtersUsed.rating === "4"}
                      value={4}
                      onClick={(e) => {
                        setFiltersUsed({
                          type: "RATINGS",
                          inputValue: e.target.value,
                        });
                      }}
                    />
                    4 ⭐ & above
                  </label>
                </div>
                <div className="sortByPrice">
                  <h3>Sắp xếp theo giá</h3>
                  <label htmlFor="lowToHigh">
                    <input
                      type="radio"
                      name="sorting"
                      id="lowToHigh"
                      value="LOWTOHIGH"
                      checked={filtersUsed.sort === "LOWTOHIGH"}
                      onClick={(e) => {
                        setFiltersUsed({
                          type: "SORT",
                          inputValue: e.target.value,
                        });
                      }}
                    />
                    Giá thấp nhất
                  </label>
                  <label htmlFor="highToLow">
                    <input
                      type="radio"
                      name="sorting"
                      id="highToLow"
                      checked={filtersUsed.sort === "HIGHTOLOW"}
                      value="HIGHTOLOW"
                      onClick={(e) => {
                        setFiltersUsed({
                          type: "SORT",
                          inputValue: e.target.value,
                        });
                      }}
                    />
                    Giá cao nhất
                  </label>
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
            }
          </div>

          <div className="displayProducts">
            {backendData?.loading ? (
              <h3>
                <Loader />
              </h3>
            ) : backendData?.error ? (
              <h3>Hiện tại dữ liệu có vấn đề</h3>
            ) : (
              <div className="productsContainer">
                {finalPriceSortedData.map((item) => {
                  console.log(item)
                  return (
                  <ProductCard item={item} />
                )})}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

/**

 * handle noproducts
 * out of stock include
 * 
 */
