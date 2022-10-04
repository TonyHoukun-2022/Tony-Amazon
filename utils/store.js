import Cookies from 'js-cookie'
import { createContext, useReducer } from 'react'

export const Store = createContext()

const initialState = {
  darkMode: Cookies.get('darkMode') === 'ON' ? true : false,
  cart: {
    //if has cookie, cartItems state will not lose after refresh
    cartItems: Cookies.get('cartItems') ? JSON.parse(Cookies.get('cartItems')) : [],
  },
  userInfo: Cookies.get('userInfo') ? JSON.parse(Cookies.get('userInfo')) : null,
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
          ...state.cart,
          cartItems: [],
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
