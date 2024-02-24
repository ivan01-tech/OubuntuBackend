import * as dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config();

const { DATABASE_URL } = process.env;
const dbConnection = async function () {
  try {
    mongoose.set('strictQuery', true);
    console.log('database : ', DATABASE_URL);
    await mongoose.connect(DATABASE_URL, {});
  } catch (err) {
    console.log('error : ', err);
  }
};

export default dbConnection;
