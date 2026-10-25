import mongoose from 'mongoose';

// Script para limpieza final y específica de MongoDB
async function finalCleanMongo() {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/test');
    
    const db = mongoose.connection.db;
    const usuariosCollection = db.collection('usuarios');
    
    console.log('🔧 Limpieza final específica para idKeycloak...');
    
    // 1. Eliminar explícitamente el índice keycloakId_1 si existe
    try {
      await usuariosCollection.dropIndex('keycloakId_1');
      console.log('✅ Índice keycloakId_1 eliminado');
    } catch (error) {
      console.log('⚠️  Índice keycloakId_1 no existe o ya fue eliminado');
    }
    
    // 2. Eliminar cualquier documento que tenga el campo keycloakId (incorrecto)
    const result = await usuariosCollection.deleteMany({ 
      keycloakId: { $exists: true } 
    });
    if (result.deletedCount > 0) {
      console.log(`🗑️  Eliminados ${result.deletedCount} documentos con campo keycloakId incorrecto`);
    }
    
    // 3. Asegurar que el índice idKeycloak_1 exista
    try {
      await usuariosCollection.createIndex({ idKeycloak: 1 }, { unique: true });
      console.log('✅ Índice idKeycloak_1 asegurado');
    } catch (error) {
      if (error.code !== 11000) {
        console.log('⚠️  Error creando índice idKeycloak_1:', error.message);
      } else {
        console.log('✅ Índice idKeycloak_1 ya existe');
      }
    }
    
    // 4. Verificación final
    const finalIndexes = await usuariosCollection.listIndexes();
    console.log('\n📋 Índices finales:');
    finalIndexes.forEach(index => {
      console.log(`  - ${index.name}: ${JSON.stringify(index.key)}`);
    });
    
    const docs = await usuariosCollection.find({}).limit(3).toArray();
    console.log('\n📋 Documentos de muestra:');
    docs.forEach(doc => {
      console.log(`  - Email: ${doc.email}, idKeycloak: ${doc.idKeycloak}`);
    });
    
    console.log('\n✅ Limpieza final completada');
    
  } catch (error) {
    console.error('❌ Error en limpieza final:', error);
  } finally {
    await mongoose.disconnect();
  }
}

finalCleanMongo();
