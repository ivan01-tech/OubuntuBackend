import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config();

const initialize = async () => {
  mongoose.set('strictQuery', true);

  const db = await mongoose.connect(process.env.DATABASE_URL as string);

  return { db };
};

export default initialize;
