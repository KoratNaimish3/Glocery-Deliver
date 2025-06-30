import jwt from 'jsonwebtoken'
//Seller Login

export const sellerLogin = async (req, res) => {
    try {
        const { email, password } = req.body

        if (!email || !password) {
            return res.status(400).json({ success: false, message: " Missing Details " })
        }

        if (password === process.env.SELLER_PASSWORD && email === process.env.SELLER_EMAIL) {
            const token = jwt.sign({ email }, process.env.SECRET_KEY, { expiresIn: '7d' })

            res.cookie('sellerToken', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: process.env.NODE_ENV === "production" ? 'none' : 'strict',
                maxAge: 7 * 24 * 60 * 60 * 1000,
            })

            return res.status(200).json({ success: true, message: " User Login Successfully" })

        } else {
            return res.status(400).json({ success: false, message: " Invalid Credential" })
        }

    } catch (error) {
        console.log("Error in login(seller) User  -> ", error.message)
        return res.status(500).json({ success: false, message: " Internal Server Error " })
    }
}


//Check isSellerAuth
export const isSellerAuth = async (req, res) => {

    try {
        return res.status(200).json({ success: true, message: " Valid User " })

    } catch (error) {
        console.log("Error in isSellerAuth(Controller)  -> ", error.message)
        return res.status(500).json({ success: false, message: " Internal Server Error " })
    }
}

//Seller Logout
export const logoutSeller = async (req, res) => {
    try {
        res.clearCookie('sellerToken', {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? 'none' : 'strict',

        })
        return res.status(200).json({ success: true, message: " Logout Successfully" })

    } catch (error) {
        console.log("Error in Logout Seller  -> ", error.message)
        return res.status(500).json({ success: false, message: " Internal Server Error " })
    }
}