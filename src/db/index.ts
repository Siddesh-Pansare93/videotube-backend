import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

const connectDB = async (): Promise<typeof mongoose> => {
  try {
    // console.log(process.env.MONGODB_URI);
    const connectionInstance = await mongoose.connect(
      `${process.env.MONGODB_URI}/${DB_NAME}`
    );
    console.log(
      `MongoDb connected !! DB_HOST : ${connectionInstance.connection.host}`
    );
    // console.log(connectionInstance) ;
    return connectionInstance;
  } catch (error) {
    console.log("MongoDb connection Error : ", error);
    process.exit(1);
  }
};

export default connectDB;
