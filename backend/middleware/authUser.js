import jwt from 'jsonwebtoken'

const authUser = async (req, res, next) => {

    try {

        const { token } = req.cookies

        if (!token) {
            return res.status(400).json({ success: false, message: " Not Authorized" })
        }

        const tokenDecode = jwt.verify(token, process.env.SECRET_KEY)

        if (tokenDecode.id) {
            req.userId =  tokenDecode.id 
            next()
        }
        else {
            return res.status(400).json({ success: false, message: " Not Authorized(Invalid Token)" })
        }


    } catch (error) {
        console.log("Error in authUser(Middleware)  -> ", error.message)
        return res.status(500).json({ success: false, message: " Internal Server Error " })
    }
}

export default authUser