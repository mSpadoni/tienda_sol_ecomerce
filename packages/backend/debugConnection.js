import { MongoDBClient } from "./config/database.js";
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

async function debugConnection() {
  try {
    await MongoDBClient.connect();

    const db = mongoose.connection.db;

    // Mostrar información de la base de datos actual
    console.log(`Base de datos actual: ${db.databaseName}`);
    console.log(`URI de conexión: ${process.env.MONGODB_URI}`);

    // Listar todas las bases de datos
    const admin = db.admin();
    const dbList = await admin.listDatabases();
    console.log("\nBases de datos disponibles:");
    dbList.databases.forEach((database) => {
      console.log(`- ${database.name} (${database.sizeOnDisk} bytes)`);
    });

    // Listar todas las colecciones en la DB actual
    const collections = await db.listCollections().toArray();
    console.log(`\nColecciones en "${db.databaseName}":`);
    collections.forEach((col) => console.log(`- ${col.name}`));

    // Buscar en todas las colecciones que contengan "notif"
    for (const col of collections) {
      if (col.name.toLowerCase().includes("notif")) {
        console.log(`\n=== Datos en colección: ${col.name} ===`);
        const data = await db.collection(col.name).find({}).toArray();
        console.log(JSON.stringify(data, null, 2));
      }
    }

    process.exit(0);
  } catch (error) {
    console.error("Error:", error);
    process.exit(1);
  }
}

debugConnection();
