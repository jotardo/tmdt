import {
    createContext,
    useContext,
    useReducer,
    useState,
    useEffect,
    useCallback,
} from "react";
import { toast } from "react-toastify";
import { reducerFilterFunction } from "../allReducers/filtersReducer";
import {
    getProduct,
    getAllProducts,
} from "../services/shopingService/shopService";
import { getAllCategories } from "../services/shopingService/categoryService";

export const DataContext = createContext();
export function DataProvider({ children }) {
    const [backendData, setBackendData] = useState({
        loading: true,
        error: null,
        productsData: [],
    });
    const [categoriesData, setCategoriesData] = useState([]);
    const [singleProduct, setSingleProduct] = useState({
        product: {},
        loading: true,
    });

    const getBackendData = async () => {
        try {
            const response = await getAllProducts();
            const productsArray = Array.isArray(response?.data)
                ? response.data
                : [];
            setBackendData({
                loading: false,
                error: null,
                productsData: productsArray,
            });
        } catch (error) {
            setBackendData({ loading: false, error: error, productsData: [] });
            console.error("Lỗi kết nối tới backend:", error);
        }
    };

    const getSingleProduct = useCallback(async (id) => {
        setSingleProduct((prev) => ({
            ...prev,
            loading: true,
        }));
        try {
            const response = await getProduct(id);
            const { status, data: productDB } = response;
            if (status === 200) {
                setSingleProduct({
                    product: productDB,
                    loading: false,
                });
            }
        } catch (error) {
            toast.error("Không thể tải sản phẩm!");
            console.log(error);
            setSingleProduct((prev) => ({
                ...prev,
                loading: false,
            }));
        }
    }, [setSingleProduct]);

    const getCategories = async () => {
        try {
            const response = await getAllCategories();
            const { status, data } = response;
            if (status === 200 && data && Array.isArray(data.categories)) {
                setCategoriesData(data.categories);
            } else {
                setCategoriesData([]);
            }
        } catch (error) {
            console.log(error);
            setCategoriesData([]);
        }
    };

    useEffect(() => {
        getBackendData();
        getCategories();
    }, []);

    const [filtersUsed, setFiltersUsed] = useReducer(reducerFilterFunction, {
        priceRange: 1500,
        search: "",
        sort: "",
        rating: "",
        ocassionFilters: [],
        categoryFilters: [],
        materialFilter: [],
    });

    const lowercaseSearch = filtersUsed.search.toLowerCase();

    const productsToFilter = Array.isArray(backendData?.productsData)
        ? backendData.productsData
        : [];

    const searchedDataValue =
        filtersUsed.search.length > 0
            ? productsToFilter.filter(
                (item) =>
                    item.name?.toLowerCase().includes(lowercaseSearch) ||
                    item.productMaterial?.toLowerCase().includes(lowercaseSearch) ||
                    item.occasion?.toLowerCase().includes(lowercaseSearch) ||
                    item.brand?.toLowerCase().includes(lowercaseSearch) ||
                    item.categoryName?.toLowerCase().includes(lowercaseSearch) ||
                    item.product_color?.toLowerCase().includes(lowercaseSearch) ||
                    item.productIsBadge?.toLowerCase().includes(lowercaseSearch)
            )
            : productsToFilter;

    const categoryFilterData =
        filtersUsed.categoryFilters.length > 0
            ? searchedDataValue.filter((item) =>
                filtersUsed.categoryFilters.some((elem) => item.categoryName === elem)
            )
            : searchedDataValue;

    const occasionFilterData =
        filtersUsed.ocassionFilters.length > 0
            ? categoryFilterData.filter((item) =>
                filtersUsed.ocassionFilters.some((elem) => item.occasion === elem)
            )
            : categoryFilterData;
    const materialFilterData =
        filtersUsed.materialFilter.length > 0
            ? occasionFilterData.filter((item) =>
                filtersUsed.materialFilter.some(
                    (elem) => item.productMaterial === elem
                )
            )
            : occasionFilterData;

    const priceRangeData =
        filtersUsed.priceRange > 0
            ? materialFilterData.filter((item) => item.price < filtersUsed.priceRange)
            : materialFilterData;
    const ratingFilter =
        filtersUsed.rating > 0
            ? priceRangeData.filter((item) => item.averageRating > filtersUsed.rating)
            : priceRangeData;
    const finalPriceSortedData =
        filtersUsed?.sort.length > 0 && filtersUsed.sort === "LOWTOHIGH"
            ? [...ratingFilter].sort((first, second) => first.price - second.price)
            : [...ratingFilter].sort((first, second) => second.price - first.price);
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
                setBackendData,
            }}
        >
            {children}
        </DataContext.Provider>
    );
}

export const useData = () => {
    return useContext(DataContext);
};