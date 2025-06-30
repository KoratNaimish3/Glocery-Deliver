import express from 'express'
import { isSellerAuth, logoutSeller, sellerLogin } from '../controllers/sellerController.js'
import authSeller from '../middleware/authSeller.js'

const sellerRouter = express.Router()

sellerRouter.post('/login',sellerLogin)
sellerRouter.post('/logout', authSeller ,logoutSeller)
sellerRouter.get('/is-auth',authSeller ,isSellerAuth)

export default sellerRouter