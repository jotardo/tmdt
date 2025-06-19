import {
    createContext,
    useContext,
    useReducer,
    useState,
    useEffect,
} from "react";
import { toast } from "react-toastify";
import { reducerFilterFunction } from "../allReducers/filtersReducer";
import productApi from "../backend/db/productApi";
import categoryApi from "../backend/db/categoryApi";

export const DataContext = createContext();
export function DataProvider({ children }) {
  /**
   * Product properties currently in focus and probably filter: {
   * name, description, price, prevPrice,
   * brand, size, productMaterial, occasion
   * }
   */
  const uniqueArrayFunc = (val, index, originalArr) => originalArr.indexOf(val) === index;
  const [backendData, setBackendData] = useState({
    loading: true,
    error: null,
    productsData: [],
  });
  const [categoriesData, setCategoriesData] = useState([]);
  const [brandData, setBrandData] = useState([]);
  const [occasionData, setOccasionData] = useState([]);
  const [singleProduct, setSingleProduct] = useState({
    product: {},
    loading: true,
  });

  const getBackendData = async () => {
    try {
      const response = await productApi.fetchExistingProducts();
      const productList = response?.data;
      setBackendData({
        ...backendData,
        loading: false,
        productsData: [...productList],
      });
      // brands
      const brandList = productList.map(product => product.brand).filter(uniqueArrayFunc);
      setBrandData(brandList);
      // occasions
      const occasionList = productList.map(product => product.occasion).filter(uniqueArrayFunc);
      setOccasionData(occasionList);
    } catch (error) {
      setBackendData({ ...backendData, loading: false, error: error });
      console.log("Lỗi kết nối tới backend:", error);
    }
  };

  // const dealInChatRoom = async (userId, productId, ctvId) => {
    
  // }


  const getSingleProduct = async (id) => {
    setSingleProduct({
      ...singleProduct,
      loading: true,
    });
    try {
      const response = await productApi.fetchProductDetail(id);
        console.log("Product API response:", response);
      const {
        status,
        data: { ...productDB },
      } = response;
      if (status === 200) {
        setSingleProduct({
          product: productDB,
          loading: false,
        });
      }
    } catch (error) {
      toast.error("Không thể tải sản phẩm!");
      console.log(error);
    }
  };
    const getCategories = async () => {
      try {
        const response = await categoryApi.fetchAllCategories();
        const {
          status,
          data: { categories },
        } = response;
        if (status === 200) setCategoriesData(categories);
      } catch (error) {
        console.log(error);
      }
    };

  useEffect(() => {
    /** refresh data every 1 min? */
      getBackendData();
      getCategories();
    const interval = setInterval(() => {
      console.log("Refreshing data every 1min")
      getBackendData();
      getCategories();
    }, 1000 * 60);
    return () => clearInterval(interval)
  }, []);

  const [filtersUsed, setFiltersUsed] = useReducer(reducerFilterFunction, {
    priceRange: 1500,
    search: "",
    sort: "",
    rating: "",
    ocassionFilters: [],
    categoryFilters: [],
    materialFilter: [],
    brandFilters: [],
  });

  const lowercaseSearch = filtersUsed.search.toLowerCase();

  const searchedDataValue =
    filtersUsed.search.length > 0
      ? backendData?.productsData.filter(
          (item) =>
            item.name.toLowerCase().includes(lowercaseSearch) ||
            item.productMaterial.toLowerCase().includes(lowercaseSearch) ||
            item.occasion.toLowerCase().includes(lowercaseSearch) ||
            item.brand.toLowerCase().includes(lowercaseSearch) ||
            item.categoryName.toLowerCase().includes(lowercaseSearch) ||
            // item.product_color.toLowerCase().includes(lowercaseSearch) ||
            item.productIsBadge.toLowerCase().includes(lowercaseSearch)
        )
      : backendData?.productsData;

  /** Filter order: search result -> category -> (*)brand -> occasion ->
   *  material -> price range -> rating.
   * AFTER ALL THAT, SORT THEM BY PRICE IF THERE ARE SORT IN PLACE
  */
  const categoryFilterData =
    filtersUsed.categoryFilters.length > 0
      ? searchedDataValue.filter((item) =>
          filtersUsed.categoryFilters.some(
            (elem) => item.categoryName === elem
          )
        )
      : searchedDataValue;

  /** yipee brand */
  const brandFilterData = 
    filtersUsed.brandFilters.length > 0
      ? categoryFilterData.filter((item) =>
          filtersUsed.brandFilters.some(
            (elem) => item.brand === elem
          )
        )
      : categoryFilterData;

  const occasionFilterData =
    filtersUsed.ocassionFilters.length > 0
      ? brandFilterData.filter((item) =>
          filtersUsed.ocassionFilters.some(
            (elem) => item.occasion === elem
          )
        )
      : brandFilterData;
  const materialFilterData =
    filtersUsed.materialFilter.length > 0
      ? occasionFilterData.filter((item) =>
          filtersUsed.materialFilter.some(
            (elem) => item.productMaterial === elem
          )
        )
      : occasionFilterData;

  const priceRangeData =
    filtersUsed.priceRange.length > 0
      ? materialFilterData.filter(
          (item) => item.price < filtersUsed.priceRange
        )
      : materialFilterData;
  const ratingFilter =
    filtersUsed.rating > 0
      ? priceRangeData.filter(
          (item) => item.product_rating > filtersUsed.rating
        )
      : priceRangeData;
  const finalPriceSortedData =
    filtersUsed?.sort.length > 0 && filtersUsed.sort === "LOWTOHIGH"
      ? ratingFilter.sort(
          (first, second) => first.price - second.price
        )
      : ratingFilter.sort(
          (first, second) => second.price - first.price
        );
  return (
    <DataContext.Provider
      value={{
        backendData,
        finalPriceSortedData,
        productCount: finalPriceSortedData.length,
        setFiltersUsed,
        categoriesData,
        getSingleProduct,
        singleProduct,
        filtersUsed,
        getBackendData,
        // added
        brandData,
        occasionData
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

export const useData = () => {
    return useContext(DataContext);
};