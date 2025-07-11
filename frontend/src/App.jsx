import React, { useEffect } from 'react'
import Navbar from './Components/Navbar'
import { Route, Routes, useLocation } from 'react-router-dom'
import Home from './Pages/Home'
import { Toaster } from 'react-hot-toast'
import Footer from './Components/Footer'
import { useAppContext } from './Context/AppContext'
import Login from './Components/Login'
import AllProducts from './Pages/AllProducts'
import ProductCategory from './Pages/ProductCategory'
import ProductDetails from './Pages/ProductDetails'
import Cart from './Pages/Cart'
import AddAdress from './Pages/AddAdress'
import MyOrders from './Pages/MyOrders'
import SellerLogin from './Components/Seller/SellerLogin'
import SellerLayout from './Pages/Seller/SellerLayout'
import AddProduct from './Pages/Seller/AddProduct'
import ProductList from './Pages/Seller/ProductList'
import Orders from './Pages/Seller/Orders'
import Loading from './Components/Loading'

function App() {

  useEffect(() => {
    // This will "wake up" your backend when the app loads
    fetch("https://greencart-backend-pvld.onrender.com")
      .then(res => console.log("Backend wake-up:", res.status))
      .catch(err => console.log("Backend error:", err));
  }, []);

  const isSellerPath = useLocation().pathname.includes("seller")
  const { showUserLogin, isSeller } = useAppContext()

  return (
    <div className='text-default min-h-screen text-gray-700 bg-white'>

      {isSellerPath ? null : <Navbar />}
      {showUserLogin ? <Login /> : ''}

      <Toaster />

      <div className={`${isSellerPath ? "" : "px-6 md:px-16 lg:px-24 xl:px-32"}`}>
        <Routes >
          <Route path='/' element={<Home />} />
          <Route path='/products' element={<AllProducts />} />
          <Route path='/products/:category' element={<ProductCategory />} />
          <Route path='/products/:category/:id' element={<ProductDetails />} />
          <Route path='/cart' element={<Cart />} />
          <Route path='/addAddress' element={<AddAdress />} />
          <Route path='/my-orders' element={<MyOrders />} />
          <Route path='/loader' element={<Loading />} />

          <Route path='/seller' element={isSeller ? <SellerLayout /> : <SellerLogin />}>
                <Route index element={<AddProduct/>}/>
                <Route path='product-list' element={<ProductList/>}/>
                <Route path='orders' element={<Orders/>}/>
          </Route>

        </Routes>
      </div>






      {isSellerPath ? null : <Footer />}

    </div>


  )
}

export default App