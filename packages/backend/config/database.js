import mongoose from "mongoose";
import logger from "../logger/logger.js";

export class MongoDBClient {
  static async connect() {
    try {
      const uri = process.env.MONGODB_URI;

      const conn = await mongoose.connect(uri);

      logger.info(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
      logger.error(`Error: ${error.message}`);
      process.exit(1);
    }
  }
}
