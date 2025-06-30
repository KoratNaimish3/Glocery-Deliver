import cookieParser from 'cookie-parser';
import express from 'express'
import cors from 'cors'
import connectDB from './configs/db.js';
import env from 'dotenv'
import userRouter from './routes/userRoute.js';
import sellerRouter from './routes/sellerRoute.js';
import connectCloudinary from './configs/cloudinary.js';
import productRouter from './routes/productRoute.js';
import cartRouter from './routes/cartRoute.js';
import addressRouter from './routes/addressRoute.js';
import orderRouter from './routes/orderRoute.js';
import { stripeWebhook } from './controllers/orderController.js';

env.config()

const app = express()
const PORT = process.env.PORT || 4000;

connectDB()
connectCloudinary()

// Allow multiple origin to access our backend  
const allowedOrigins = ["https://greencart-frontend-dcu9.onrender.com"]

app.post('/stripe' , express.raw({type:'application/json'}) , stripeWebhook)

//Middleware Configuration
app.use(express.json())
app.use(cookieParser())
app.use(cors({
    origin: allowedOrigins,
    credentials:true
}))
 
//Route
app.use('/api/user' , userRouter)
app.use('/api/seller',sellerRouter)
app.use('/api/product' , productRouter)
app.use('/api/cart' , cartRouter)
app.use('/api/address' , addressRouter)
app.use('/api/order' , orderRouter)


app.get('/',(req , res)=> res.send("API is working"))

app.listen(PORT , ()=>{console.log(`Server is running on port : ${PORT}`)})
