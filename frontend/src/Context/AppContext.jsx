import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { dummyProducts } from "../assets/assets";
import { toast } from 'react-hot-toast'
import axios from "axios"

axios.defaults.baseURL = "https://greencart-backend-pvld.onrender.comhttps://greencart-backend-pvld.onrender.com"
axios.defaults.withCredentials = true //send cookie to api request

export const AppContext = createContext()

export const AppContextProvider = ({ children }) => {

    const currency = import.meta.env.VITE_CURRENCY

    const navigate = useNavigate()
    const [user, setUser] = useState(null)
    const [isSeller, setIsSeller] = useState(false)
    const [showUserLogin, setShowUserLogin] = useState(false)
    const [products, setProducts] = useState([])
    const [cartItems, setCartItems] = useState({})
    const [searchQuery, setSearchQuery] = useState({})


    // fetch seller status
    const fetchseller = async () => {
        try {
            const { data } = await axios.get('/api/seller/is-auth')

            if (data.success) {
                setIsSeller(true)
            } else {
                setIsSeller(false)
            }
        } catch (error) {
            setIsSeller(false)
        }
    }

    // fetch user status ,data , cartItems
    const fetchUser = async () => {
        try {
            const { data } = await axios.get('/api/user/is-auth')

            if (data.success) {
                setUser(data.user)
                setCartItems(data.user.cartItems)
            }
        } catch (error) {
            setUser(null)
        }
    }


    // Fetch All Products
    const fetchProducts = async () => {
        try {
            const { data } = await axios.get('/api/product/list')

            if (data.success) {
                setProducts(data.products)
            }

        } catch (error) {
            console.error(" error in  fetch All product (axios)", error);
            if (error.response && error.response.data && error.response.data.message) {
                toast.error(error.response.data.message)
            }
            else {
                toast.error("An unexpected error occurred. Please try again.");
            }
        }
    }

    //Add Product To Cart
    const addToCart = (itemsID) => {
        let cartData = structuredClone(cartItems)
        if (cartData[itemsID]) {
            cartData[itemsID] += 1
        } else {
            cartData[itemsID] = 1
        }

        setCartItems(cartData)
        toast.success('Added To Cart')
    }

    //Update Product To Cart
    const updateCardItems = (itemsID, quantity) => {
        let cartData = structuredClone(cartItems)
        cartData[itemsID] = quantity
        setCartItems(cartData)
        toast.success(' Cart Updated')
    }

    //Remove Product From Cart

    const removeFromCart = (itemsID) => {
        let cartData = structuredClone(cartItems)
        if (cartData[itemsID]) {
            cartData[itemsID] -= 1
            if (cartData[itemsID] === 0) {
                delete cartData[itemsID]
            }
        }
        toast.success('Remove From Cart ')
        setCartItems(cartData)
    }


    //Get Card Item Count
    const getCartCount = () => {
        let totalCount = 0;
        for (const item in cartItems) {
            totalCount += cartItems[item]
        }

        return totalCount
    }

    //Get Cart Total Amount

    const getCartAmount = () => {
        let totalAmount = 0;
        for (const items in cartItems) {
            let itemInfo = products.find((product) => product._id === items)
            if (cartItems[items] > 0) {
                totalAmount += itemInfo.offerPrice * cartItems[items]
            }
        }


        return Math.floor(totalAmount * 100) / 100;
    }

    useEffect(() => {
        fetchProducts()
        fetchseller()
        fetchUser()
    }, [])

    //Update Database cart Items
    useEffect(() => {
        const updateCart = async () => {
            try {
                // console.log("Sending cartItems to backend:", cartItems)
                const { data } = await axios.post('/api/cart/update', { cartItems })
                // console.log("cart updated")

            } catch (error) {
                console.error(" error in  update cart Items (axios)", error);
                if (error.response && error.response.data && error.response.data.message) {
                    toast.error(error.response.data.message)
                }
                else {
                    toast.error("An unexpected error occurred. Please try again.");
                }
            }
        }

        if (user) {
            updateCart()
        }

    }, [cartItems, user])


    const value = { axios, navigate, user, setUser, isSeller, setIsSeller, showUserLogin, setShowUserLogin, products, currency, cartItems, setCartItems, addToCart, updateCardItems, removeFromCart, searchQuery, setSearchQuery, getCartAmount, getCartCount, fetchProducts }

    return <AppContext.Provider value={value}>
        {children}
    </AppContext.Provider>
}

export const useAppContext = () => {
    return useContext(AppContext)
}
