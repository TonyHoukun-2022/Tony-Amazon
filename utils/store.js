import Cookies from 'js-cookie'
import { createContext, useReducer } from 'react'

export const Store = createContext()

const initialState = {
  darkMode: Cookies.get('darkMode') === 'ON' ? true : false,
  cart: {
    //if has cookie, cartItems state will not lose after refresh
    cartItems: Cookies.get('cartItems') ? JSON.parse(Cookies.get('cartItems')) : [],
    shippingInfo: Cookies.get('shippingInfo') ? JSON.parse(Cookies.get('shippingInfo')) : {},
    paymentMethod: Cookies.get('paymentMethod') ? JSON.parse(Cookies.get('paymentMethod')) : '',
  },
  userInfo: Cookies.get('userInfo') ? JSON.parse(Cookies.get('userInfo')) : null,
  order: {
    loading: false,
    orderInfo: {},
    error: '',
  },
  pay: {
    payData: {},
    payLoading: false,
    paySuccess: false,
    payError: '',
  },
  deliver: {
    deliverLoading: false,
    deliverSuccess: false,
    deliverError: '',
  },
}

function reducer(state, action) {
  switch (action.type) {
    case 'DARK_MODE_ON':
      return { ...state, darkMode: true }
    case 'DARK_MODE_OFF':
      return { ...state, darkMode: false }
    case 'CART_ADD_ITEM': {
      const newItem = action.payload
      //check if the payload is existed in cartItems
      const existedItem = state.cart.cartItems.find((item) => item._id === newItem._id)
      //if payload exists, replace the old one with payload, otherwise add in
      const cartItems = existedItem ? state.cart.cartItems.map((item) => (item.name === existedItem.name ? newItem : item)) : [...state.cart.cartItems, newItem]
      //stringfy cartitems array and set it as cookie
      Cookies.set('cartItems', JSON.stringify(cartItems))
      return {
        ...state,
        cart: {
          ...state.cart,
          cartItems,
        },
      }
    }
    case 'CART_REMOVE_ITEM': {
      const cartItems = state.cart.cartItems.filter((item) => item._id !== action.payload._id)
      Cookies.set('cartItems', JSON.stringify(cartItems))
      return {
        ...state,
        cart: {
          ...state.cart,
          cartItems,
        },
      }
    }
    case 'CART_CLEAR':
      return {
        ...state,
        cart: {
          ...state.cart,
          cartItems: [],
        },
      }
    case 'SAVE_SHIPPING_INFO':
      return {
        ...state,
        cart: {
          ...state.cart,
          shippingInfo: action.payload,
        },
      }
    case 'SAVE_PAYMENT_METHOD':
      return {
        ...state,
        cart: {
          ...state.cart,
          paymentMethod: action.payload,
        },
      }
    case 'USER_LOGIN': {
      return {
        ...state,
        userInfo: action.payload,
      }
    }
    case 'USER_LOGOUT':
      return {
        ...state,
        userInfo: null,
        cart: {
          cartItems: [],
          shippingInfo: {},
          paymentMethod: '',
        },
      }
    case 'FETCH_ORDER':
      return {
        ...state,
        order: {
          ...state.order,
          loading: true,
        },
      }
    case 'FETCH_ORDER_SUCCESS':
      return {
        ...state,
        order: {
          ...state.order,
          loading: false,
          orderInfo: action.payload,
          error: '',
        },
      }
    case 'FETCH_ORDER_FAIL':
      return {
        ...state,
        order: {
          ...state.order,
          loading: false,
          orderInfo: {},
          error: action.payload,
        },
      }
    case 'PAY_REQUEST': {
      return {
        ...state,
        pay: {
          ...state.pay,
          payLoading: true,
          payError: '',
          paySuccess: false,
        },
      }
    }
    case 'PAY_SUCCESS': {
      return {
        ...state,
        pay: {
          ...state.pay,
          payData: action.payload,
          payError: '',
          payLoading: false,
          paySuccess: true,
        },
      }
    }
    case 'PAY_FAIL': {
      return {
        ...state,
        pay: {
          ...state.pay,
          payData: {},
          payError: action.payload,
          payLoading: false,
          paySuccess: false,
        },
      }
    }
    case 'PAY_RESET': {
      return {
        ...state,
        pay: {
          ...state.pay,
          payData: {},
          payError: '',
          payLoading: false,
          paySuccess: false,
        },
      }
    }
    case 'DELIVER_REQUEST':
      return {
        ...state,
        deliver: {
          ...state.deliver,
          deliverLoading: true,
          deliverSuccess: false,
          deliverError: '',
        },
      }
    case 'DELIVER_SUCCESS':
      return {
        ...state,
        deliver: {
          ...state.deliver,
          deliverLoading: false,
          deliverSuccess: true,
          deliverError: '',
        },
      }
    case 'DELIVER_FAIL':
      return {
        ...state,
        deliver: {
          ...state.deliver,
          deliverLoading: false,
          deliverSuccess: false,
          deliverError: action.payload,
        },
      }
    case 'DELIVER_RESET':
      return {
        ...state,
        deliver: {
          ...state.deliver,
          deliverLoading: true,
          deliverSuccess: false,
          deliverError: '',
        },
      }
    default:
      return state
  }
}

export function StoreProvider(props) {
  const [state, dispatch] = useReducer(reducer, initialState)
  const value = { state, dispatch }
  return <Store.Provider value={value}>{props.children}</Store.Provider>
}
