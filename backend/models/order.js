import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({

    userId: {
        type: String,
        require: true,
        ref: 'user'
    },

    items: [{
        product: {
            type: String,
            require: true,
            ref: 'product'
        },

        quantity:{
             type: Number,
            require: true,
        },
    }],
    
    amount: {
        type: Number,
        require: true,
    },

    address: {
        type: String,
        require: true,
        ref:'address'
    },

    status: {
        type: String,
        default:"order Placed"
    },

    paymentType: {
        type: String,
        require: true,
    },

    isPaid: {
        type: Boolean,
        require: true,
        default:false,
    },

}, { timestamps: true })

const Order = mongoose.models.order || mongoose.model('order', orderSchema)

export default Order
