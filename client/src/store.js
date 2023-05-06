import { legacy_createStore as createStore, combineReducers, applyMiddleware } from 'redux' ;
import thunk from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension'

import { productReducer, productDetailsReducer, newReviewReducer, newProductReducer,  product_UD_Reducer } from './reducers/productReducers'
import { authReducer , userReducer, forgotPasswordReducer} from './reducers/userReducers';
import { cartReducer } from './reducers/cartReducers';
import { newOrderReducer, myOrdersReducer, orderDetailsReducer } from './reducers/orderReducer';


const reducer = combineReducers({
    products: productReducer,
    productDetails: productDetailsReducer,
    newProduct: newProductReducer,
    auth: authReducer,
    user: userReducer,
    forgotPassword: forgotPasswordReducer,
    cart: cartReducer,
    newOrder: newOrderReducer,
    myOrders: myOrdersReducer,
    orderDetails: orderDetailsReducer,
    newReview: newReviewReducer,
    product_UD: product_UD_Reducer,
    
})


let initialState  = {
    cart:{
        cartItems: localStorage.getItem('cartItems')
            ? JSON.parse(localStorage.getItem('cartItems'))
            : [],
        shippingInfo: localStorage.getItem('shippingInfo')
            ? JSON.parse(localStorage.getItem('shippingInfo'))
            : []
    }
}

const middleware = [thunk];
const store = createStore(reducer, initialState, composeWithDevTools(applyMiddleware(...middleware)))


export default store;