import { v2 as cloudinary } from 'cloudinary'
import Product from '../models/product.js'


//Add Product
export const addProduct = async (req, res) => {

    try {
        const productData = JSON.parse(req.body.productData)

        const images = req.files

        let imgesUrl = await Promise.all(
            images.map(async (item) => {
                let result = await cloudinary.uploader.upload(item.path, { resource_type: "image" })
                return result.secure_url
            })
        )

        await Product.create({
            ...productData,
            image: imgesUrl
        })

        return res.status(200).json({ success: true, message: " Prodect Added " })


    } catch (error) {

        console.log("Error in Add Product  -> ", error.message)
        return res.status(500).json({ success: false, message: " Internal Server Error " })
    }

}

//Get Product
export const productList = async (req, res) => {

    try {

        const products = await Product.find({})

        if (!products) {
            return res.status(400).json({ success: false, message: " Product Not Available " })
        }

        return res.status(200).json({ success: true, products })


    } catch (error) {

        console.log("Error in Get Product List   -> ", error.message)
        return res.status(500).json({ success: false, message: " Internal Server Error " })
    }
}

//Get Single Product
export const productById = async (req, res) => {

    try {

        const { id } = req.body

        const product = await Product.findById(id)

        if (!product) {
            return res.status(400).json({ success: false, message: " Product Not Available " })
        }

        return res.status(200).json({ success: true, product })


    } catch (error) {
        console.log("Error in Get Single Product   -> ", error.message)
        return res.status(500).json({ success: false, message: " Internal Server Error " })
    }

}

//Change Product inStock
export const changeStock = async (req, res) => {

    try {
        const { id , inStock } = req.body
        
        const product = await Product.findByIdAndUpdate(id , {inStock})

        if(!product)
        {
            return res.status(400).json({ success: false, message: " Product Not Available(instock) " })
        }

        return res.status(200).json({ success: true, message:' Stock Updated' })


    } catch (error) {
        console.log("Error in Change Stock  -> ", error.message)
        return res.status(500).json({ success: false, message: " Internal Server Error " })
        
    }

}