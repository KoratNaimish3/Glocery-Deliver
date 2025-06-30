import React from 'react'
import Mainbanner from '../Components/Home/Mainbanner'
import Categories from '../Components/Home/Categories'
import BestSeller from '../Components/Home/BestSeller'
import BottomBanner from '../Components/Home/BottomBanner'
import NewsLetter from '../Components/Home/NewsLetter'


const Home = () => {
  return (
    <div className='mt-10'>
        <Mainbanner/>
        <Categories/>
        <BestSeller/>
        <BottomBanner/>
        <NewsLetter/> 
      
    </div>
  )
}

export default Home