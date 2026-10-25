import mongoose from "mongoose";
import logger from "../logger/logger.js";

let connectionPromise = null;

export class MongoDBClient {
  static async connect() {
    if (mongoose.connection.readyState === 1) return mongoose.connection;
    if (!connectionPromise) {
      connectionPromise = mongoose
        .connect(process.env.MONGODB_URI, { dbName: process.env.MONGODB_DB_NAME })
        .then((conn) => {
          logger.info(`MongoDB Connected: ${conn.connection.host}`);
          return conn;
        })
        .catch((error) => {
          connectionPromise = null;
          logger.error(`Error: ${error.message}`);
          if (!process.env.VERCEL) process.exit(1);
          throw error;
        });
    }
    return connectionPromise;
  }
}
