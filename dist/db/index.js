import dotenv from 'dotenv';
import mongoose from 'mongoose';
dotenv.config();
const initialize = async () => {
    console.log('first time : ', process.env.DATABASE_URL);
    mongoose.set('strictQuery', true);
    const db = await mongoose.connect(process.env.DATABASE_URL);
    return { db };
};
export default initialize;
