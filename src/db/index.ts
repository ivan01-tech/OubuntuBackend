/* eslint-disable consistent-return */
import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config();
const { DATABASE_URL } = process.env;

const initialize = async () => {
  mongoose.set('strictQuery', true);

  const db = await mongoose.connect(DATABASE_URL as string);
  console.log('\nConnected to database : ', DATABASE_URL, '\n');

  return { db };
};

export default initialize;
