export const initialWishList = {
    backendWishList: [],
    loading: true,
};

const uniqueArrayOfObjects = (array) => array.reduce((acc, current) => {
    const exists = acc.some(obj => obj.id === current.id);
    if (!exists) {
        acc.push(current);
    }
    return acc;
}, []);

export const wishReducerFunction = (state, action) => {
    const { type, payload } = action;

    switch (type) {
        case "ALLWISHLIST":
            return { ...state, backendWishList: action.payload };

        case "ADDTOWISH":
            return {
                loading: false,
                backendWishList: uniqueArrayOfObjects([
                    ...state.backendWishList,
                    payload,
                ]),
            };

        case "DELETEWISH":
            return {
                loading: false,
                backendWishList: state.backendWishList.filter(
                    item => item.productId !== payload
                ),
            };

        default:
            console.log("something is wrong in wishlist reducer function");
            return state;
    }
};

