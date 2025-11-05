import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

export async function checkTestDB() {
  try {
    // Conectar directamente a la base de datos 'test'
    await mongoose.connect("mongodb://localhost:27017/test");

    const db = mongoose.connection.db;
    console.log(`Conectado a base de datos: ${db.databaseName}`);

    // Listar colecciones en 'test'
    const collections = await db.listCollections().toArray();
    console.log('\nColecciones en "test":');
    collections.forEach((col) => console.log(`- ${col.name}`));

    // Buscar notificaciones en 'test'
    for (const col of collections) {
      if (col.name.toLowerCase().includes("notif")) {
        console.log(`\n=== Datos en colección test.${col.name} ===`);
        const data = await db.collection(col.name).find({}).toArray();
        console.log(JSON.stringify(data, null, 2));
      }
    }

    for (const col of collections) {
      if (col.name.toLowerCase().includes("prod")) {
        console.log(`\n=== Datos en colección test.${col.name} ===`);
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

checkTestDB();

