import mongoose from 'mongoose';
import logger from '../logger/logger.js';

// Script para limpiar índices antiguos de MongoDB
async function fixMongoIndexes() {
  try {
    // Conectar a MongoDB
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/test');
    
    // Obtener la colección de usuarios
    const db = mongoose.connection.db;
    const usuariosCollection = db.collection('usuarios');
    
    // Eliminar índice antiguo keycloakId si existe
    try {
      await usuariosCollection.dropIndex('keycloakId_1');
      logger.info('Índice antiguo keycloakId eliminado exitosamente');
    } catch (error) {
      if (error.code !== 27) { // Error 27 = Index not found
        logger.error('Error al eliminar índice keycloakId:', error);
      } else {
        logger.info('Índice keycloakId no existe, continuando...');
      }
    }
    
    // Verificar índices actuales
    const indexes = await usuariosCollection.listIndexes();
    logger.info('Índices actuales en la colección usuarios:');
    indexes.forEach(index => {
      logger.info(`- ${index.name}: ${JSON.stringify(index.key)}`);
    });
    
    // Limpiar documentos con keycloakId: null si existen
    const result = await usuariosCollection.deleteMany({ keycloakId: null });
    if (result.deletedCount > 0) {
      logger.info(`Eliminados ${result.deletedCount} documentos con keycloakId: null`);
    }
    
    logger.info('Limpieza de MongoDB completada exitosamente');
    
  } catch (error) {
    logger.error('Error en la limpieza de MongoDB:', error);
  } finally {
    await mongoose.disconnect();
  }
}

// Ejecutar la función
fixMongoIndexes();
