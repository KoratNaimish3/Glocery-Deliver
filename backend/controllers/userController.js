import User from "../models/user.js"
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'


// Register User
export const register = async (req, res) => {
    try {

        const { name, email, password } = req.body

        if (!name || !email || !password) {
            return res.status(400).json({ success: false, message: " Missing Details " })
        }

        const exitsUser = await User.findOne({ email })

        if (exitsUser) {
            return res.status(400).json({ success: false, message: " User Already Exist " })
        }

        const hashPassword = await bcrypt.hash(password, 10)

        const user = await User.create({
            name,
            email,
            password: hashPassword
        })

        const token = jwt.sign({ id: user._id }, process.env.SECRET_KEY, { expiresIn: '7d' })

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? 'none' : 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000,
        })

        return res.status(200).json({ success: true, message: " User Register Successfully",  user:{name : user.name ,email:user.email , cartItems : user.cartItems }})

    } catch (error) {
        console.log("Error in Register User  -> ", error.message)
        return res.status(500).json({ success: false, message: " Internal Server Error " })
    }
}


//Login User 
export const login = async (req, res) => {
    try {
        const { email, password } = req.body

        if (!email || !password) {
            return res.status(400).json({ success: false, message: " Missing Details " })
        }

        const user = await User.findOne({ email })
        if (!user) {
            return res.status(400).json({ success: false, message: " User Not Found " })
        }

        const isMatch = await bcrypt.compare(password, user.password)

        if (!isMatch) {
            return res.status(400).json({ success: false, message: " Invalid Password " })
        }

        const token = jwt.sign({ id: user._id }, process.env.SECRET_KEY, { expiresIn: '7d' })

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? 'none' : 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000,
        })

        return res.status(200).json({ success: true, message: " User Login Successfully", user:{name : user.name ,email:user.email , cartItems : user.cartItems } })

    } catch (error) {
        console.log("Error in Login User  -> ", error.message)
        return res.status(500).json({ success: false, message: " Internal Server Error " })
    }
}

//Logout User

export const logout = async (req, res) => {
    try {
        res.clearCookie('token', {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? 'none' : 'strict',

        })
        return res.status(200).json({ success: true, message: " User Logout Successfully" })

    } catch (error) {
        console.log("Error in Logout User  -> ", error.message)
        return res.status(500).json({ success: false, message: " Internal Server Error " })
    }
}

// Check Auth

export const isAuth = async (req, res) => {

    try {
        const userId = req.userId
        const user = await User.findById(userId).select("-password")
        if (!user) {
            return res.status(400).json({ success: false, message: " Unauthorized : User not found" })
        }

        return res.status(200).json({ success: true, message: " Valid User ", user })


    } catch (error) {
        console.log("Error in isAuth(Controller)  -> ", error.message)
        return res.status(500).json({ success: false, message: " Internal Server Error " })
    }
}
