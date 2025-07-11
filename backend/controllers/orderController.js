import Order from "../models/order.js"
import Product from "../models/product.js"
import User from "../models/user.js"
import stripe from "stripe"

// Place Order COD
export const placeOrderCOD = async (req, res) => {
    try {

        const { items, address } = req.body
        console.log(userId)
        console.log(address)
        console.log(items)

        const userId = req.userId

        if (!address || items.length === 0) {
            return res.status(400).json({ success: false, message: " Invalid Data " })
        }

        //calculate amount using items
        let amount = await items.reduce(async (acc, item) => {
            const product = await Product.findById(item.product)
            return (await acc) + product.offerPrice * item.quantity
        }, 0)

        //add tax charge (2%)

        amount += Math.floor(amount * 0.02)


        await Order.create({

            userId,
            items,
            amount,
            address,
            paymentType: "COD",
        })



        return res.status(200).json({ success: true, message: " Order Place Successfully " })


    } catch (error) {
        console.log("Error in Place (COD)  -> ", error.message)
        return res.status(500).json({ success: false, message: " Internal Server Error " })
    }
}

// Place Order Stripe
export const placeOrderStripe = async (req, res) => {
    try {

        const { items, address } = req.body
        const { origin } = req.headers

        const userId = req.userId

        if (!address || items.length === 0) {
            return res.status(400).json({ success: false, message: " Invalid Data " })
        }

        let productData = []

        //calculate amount using items
        let amount = await items.reduce(async (acc, item) => {
            const product = await Product.findById(item.product)
            productData.push({
                name: product.name,
                price: product.offerPrice,
                quantity: item.quantity,
            })
            return (await acc) + product.offerPrice * item.quantity
        }, 0)

        //add tax charge (2%)

        amount += Math.floor(amount * 0.02)

        const order = await Order.create({

            userId,
            items,
            amount,
            address,
            paymentType: "Online",
        })

        //stripe Gateway Initaalize

        const stripeInstance = new stripe(process.env.STRIPE_SECRET_KEY)

        //create line items for stripe
        const line_items = productData.map((item) => {
            return {
                price_data: {
                    currency: "aud",

                    product_data: {
                        name: item.name,
                    },

                    unit_amount: Math.floor(item.price + item.price * 0.02) * 100,
                },

                quantity: item.quantity
            }
        })

        //create session 

        const session = await stripeInstance.checkout.sessions.create({
            line_items,
            mode: "payment",
            success_url: `${origin}/loader?next=my-orders`,
            cancel_url: `${origin}/cart`,
            metadata: {
                orderId: order._id.toString(),
                userId,
            }
        })

        return res.status(200).json({ success: true, url: session.url })


    } catch (error) {
        console.log("Error in Place Order (online) -> ", error.message)
        return res.status(500).json({ success: false, message: " Internal Server Error " })
    }
}

//stripe webhook to verify payment action 
export const stripeWebhook = async (req, res) => {
    const stripeInstance = new stripe(process.env.STRIPE_SECRET_KEY);

    const sig = req.headers["stripe-signature"];
    let event;

    try {
        event = stripeInstance.webhooks.constructEvent(
            req.body,
            sig,
            process.env.STRIPE_WEBHOOK_SECRET
        );
    } catch (error) {
        console.log("Webhook signature error:", error.message);
        return res.status(400).json({ success: false, message: "Webhook signature verification failed." });
    }

    try {
        switch (event.type) {
            case "payment_intent.succeeded": {
                const paymentIntent = event.data.object;
                const paymentIntentId = paymentIntent.id;

                const session = await stripeInstance.checkout.sessions.list({
                    payment_intent: paymentIntentId,
                });

                const { orderId, userId } = session.data[0].metadata;

                await Order.findByIdAndUpdate(orderId, { isPaid: true });
                await User.findByIdAndUpdate(userId, { cartItems: {} });

                break;
            }

            case "payment_intent.payment_failed": {
                const paymentIntent = event.data.object;
                const paymentIntentId = paymentIntent.id;

                const session = await stripeInstance.checkout.sessions.list({
                    payment_intent: paymentIntentId,
                });

                const { orderId } = session.data[0].metadata;
                await Order.findByIdAndDelete(orderId);

                break;
            }

            default:
                console.log(`Unhandled event type ${event.type}`);
        }

        res.json({ received: true });

    } catch (error) {
        console.log("Error processing Stripe webhook:", error.message);
        return res.status(500).json({ success: false });
    }
};


// Get Order by User Id

export const getUserOrder = async (req, res) => {
    try {

        const userId = req.userId

        const orders = await Order.find({
            userId,
            $or: [{ paymentType: "COD" }, { isPaid: true }]
        }).populate('items.product address').sort({ createdAt: -1 })


        if (!orders) {
            return res.status(400).json({ success: false, message: " Order Not Available " })
        }

        return res.status(200).json({ success: true, orders })

    } catch (error) {
        console.log("Error in Get Order By User ID   -> ", error.message)
        return res.status(500).json({ success: false, message: " Internal Server Error " })
    }
}

//Get All Orders (For Admin / seller)

export const getAllOrders = async (req, res) => {
    try {

        const orders = await Order.find({
            $or: [{ paymentType: "COD" }, { isPaid: true }]
        }).populate('items.product address').sort({ createdAt: -1 })

        if (!orders) {
            return res.status(400).json({ success: false, message: " Order Not Available " })
        }

        return res.status(200).json({ success: true, orders })

    } catch (error) {
        console.log("Error in Get All Order(admin/seller)   -> ", error.message)
        return res.status(500).json({ success: false, message: " Internal Server Error " })
    }
}