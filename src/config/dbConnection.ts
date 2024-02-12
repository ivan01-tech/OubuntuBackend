import { join } from 'path';

import * as dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config();

const dbConnection = async function () {
  try {
    mongoose.set('strictQuery', true);
    await mongoose.connect(process.env.DATABASE_URL!, {});
  } catch (err) {
    console.log('error : ', err);
  }
};

export default dbConnection;
