import mongoose from 'mongoose'
import 'dotenv/config'


export const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.DB);
        console.log(` MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(` MongoDB Connection Error: ${error.message}`);
        
    }
};