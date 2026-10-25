import mongoose from 'mongoose';
import logger from '../logger/logger.js';

// Script para limpiar completamente MongoDB y forzar schema correcto
async function forceCleanMongo() {
  try {
    // Conectar a MongoDB
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/test');
    
    // Obtener la colección de usuarios
    const db = mongoose.connection.db;
    const usuariosCollection = db.collection('usuarios');
    
    console.log('🔧 Iniciando limpieza agresiva de MongoDB...');
    
    // 1. Eliminar TODOS los índices excepto _id_
    const indexes = await usuariosCollection.listIndexes();
    const indexesArray = Array.from(indexes);
    for (const index of indexesArray) {
      if (index.name !== '_id_') {
        try {
          await usuariosCollection.dropIndex(index.name);
          console.log(`✅ Índice eliminado: ${index.name}`);
        } catch (error) {
          console.log(`⚠️  No se pudo eliminar índice ${index.name}:`, error.message);
        }
      }
    }
    
    // 2. Eliminar todos los documentos con keycloakId (campo incorrecto)
    const result1 = await usuariosCollection.deleteMany({ keycloakId: { $exists: true } });
    if (result1.deletedCount > 0) {
      console.log(`🗑️  Eliminados ${result1.deletedCount} documentos con campo keycloakId`);
    }
    
    // 3. Eliminar documentos con idKeycloak: null
    const result2 = await usuariosCollection.deleteMany({ idKeycloak: null });
    if (result2.deletedCount > 0) {
      console.log(`🗑️  Eliminados ${result2.deletedCount} documentos con idKeycloak: null`);
    }
    
    // 4. Crear índice correcto explicitamente
    try {
      await usuariosCollection.createIndex({ idKeycloak: 1 }, { unique: true });
      console.log('✅ Índice idKeycloak_1 creado correctamente');
    } catch (error) {
      if (error.code !== 11000) { // Si no es error de duplicado
        console.log('⚠️  Error creando índice idKeycloak:', error.message);
      }
    }
    
    // 5. Verificar estado final
    const finalIndexes = await usuariosCollection.listIndexes();
    console.log('\n📋 Índices finales:');
    finalIndexes.forEach(index => {
      console.log(`  - ${index.name}: ${JSON.stringify(index.key)}`);
    });
    
    const totalDocs = await usuariosCollection.countDocuments();
    console.log(`\n📊 Total documentos en usuarios: ${totalDocs}`);
    
    console.log('\n✅ Limpieza agresiva completada');
    
  } catch (error) {
    console.error('❌ Error en limpieza agresiva:', error);
  } finally {
    await mongoose.disconnect();
  }
}

// Ejecutar la función
forceCleanMongo();
