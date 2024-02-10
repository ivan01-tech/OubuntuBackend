import * as dotenv from "dotenv";
import mongoose from "mongoose";
import { join } from "path";
dotenv.config({ path: join(process.cwd(), "src", ".env") });

const dbConnection = async function () {
  try {
    mongoose.set("strictQuery", true);
    await mongoose.connect(process.env.DATABASE_URL!, {});
  } catch (err) {
    console.log("error : ", err);
  }
};

export default dbConnection;
