import Address from "../models/address.js"

//Add Address
export const addAddress = async (req, res) => {
    try {

        const { address } = req.body
        const userId = req.userId

        await Address.create({
            ...address,
            userId,
        })

        return res.status(200).json({ success: true, message: " Address added Successfully" })


    } catch (error) {
        console.log("Error in Add address  -> ", error.message)
        return res.status(500).json({ success: false, message: " Internal Server Error " })
    }
}

//Get Address

export const getAddress = async (req, res) => {
    try {

        const userId = req.userId

        const addresses = await Address.find({ userId })

        if (!addresses) {
            return res.status(400).json({ success: false, message: " Address not found" })
        }

        return res.status(200).json({ success: true, addresses })


    } catch (error) {
        console.log("Error in Get address  -> ", error.message)
        return res.status(500).json({ success: false, message: " Internal Server Error " })
    }
}