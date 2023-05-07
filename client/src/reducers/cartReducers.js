import { ADD_TO_CART, REMOVE_ITEM_CART, SAVE_SHIPPING_INFORMATION } from '../constants/cartConstants'

export const cartReducer = (state = { cartItems: [], shippingInformation: {} }, action) => {
    switch (action.type) {

        case ADD_TO_CART:
            const item = action.payload;

            const isItemExist = state.cartItems.find(i => i.product === item.product)

            if (isItemExist) {
                return {
                    ...state,
                    cartItems: state.cartItems.map(i => i.product === isItemExist.product ? item : i)
                }
            } else {
                return {
                    ...state,
                    cartItems: [...state.cartItems, item]
                }
            }

        case REMOVE_ITEM_CART:
            return {
                ...state,
                cartItems: state.cartItems.filter(i => i.product !== action.payload)
            }


        case SAVE_SHIPPING_INFORMATION:
            return {
                ...state,
                shippingInformation: action.payload
            }


        default:
            return state
    }
}