import mongoose from "mongoose";
import logger from "../../logger/logger.js";
export class MongoDBClient {
  static async connect() {
    try {
      const conn = await mongoose.connect(
        `${process.env.MONGODB_URI}?authSource=admin`,
      );

      logger.info(`MongoDB is Connected: ${conn.connection.host}`);
    } catch (error) {
      logger.error(`Error: ${error.message}`);
      process.exit(1);
    }
  }
}
