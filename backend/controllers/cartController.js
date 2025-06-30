import User from "../models/user.js"

export const updateCart = async (req, res) => {
    try {
        const {  cartItems } = req.body
        const userId = req.userId

        const user = await User.findByIdAndUpdate(
            userId,
          {cartItems} // optional: returns the updated user
        )

        if (!user) {
            return res.status(400).json({ success: false, message: "User Not Found" })
        }

        return res.status(200).json({ success: true, message: "Cart Updated" })

    } catch (error) {
        console.log("Error in update Cart ->", error.message)
        return res.status(500).json({ success: false, message: "Internal Server Error" })
    }
}
