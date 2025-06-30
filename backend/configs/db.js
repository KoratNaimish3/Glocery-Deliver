import mongoose from "mongoose";

const connectDB = async()=>{
    try {
        
        mongoose.connection.on('connected' , ()=>console.log("Database Connected"))
        await mongoose.connect(`${process.env.MONGO_URL}/greenCart`)


    } catch (error) {
        console.log("Error in DB_Config -> ",error.message)
    }
}

export default connectDB