import jwt from 'jsonwebtoken'

const authSeller = async (req, res, next) => {

    try {

        const { sellerToken } = req.cookies

        if (!sellerToken) {
            return res.status(400).json({ success: false, message: " Not Authorized" })
        }

        const tokenDecode = jwt.verify(sellerToken, process.env.SECRET_KEY)

        if (tokenDecode.email === process.env.SELLER_EMAIL) {
            next()
        }
        else {
            return res.status(400).json({ success: false, message: " Not Authorized(Invalid)" })
        }

    } catch (error) {
        console.log("Error in authSeller(Middleware)  -> ", error.message)
        return res.status(500).json({ success: false, message: " Internal Server Error " })
    }
}

export default authSeller