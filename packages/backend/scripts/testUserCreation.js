import mongoose from 'mongoose';
import UsuarioService from '../service/usuarioService.js';
import usuarioRepository from '../models/repository/usuariosRepository.js';
import logger from '../logger/logger.js';

// Script para probar la creación de usuarios
async function testUserCreation() {
  try {
    // Conectar a MongoDB
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/test');
    
    console.log('🧪 Iniciando prueba de creación de usuario...');
    
    // Crear instancia del servicio
    const usuarioService = new UsuarioService(usuarioRepository);
    
    // Datos de prueba
    const testUser = {
      nombre: "Usuario",
      apellido: "Prueba",
      email: "test@example.com",
      telefono: "123456789",
      rol: "comprador",
      password: "Test123!"
    };
    
    console.log('📝 Datos de usuario:', testUser);
    
    // Intentar crear usuario
    try {
      const result = await usuarioService.crear(testUser);
      console.log('✅ Usuario creado exitosamente:', result);
    } catch (error) {
      console.log('❌ Error al crear usuario:', error.message);
      
      // Verificar si el error es de MongoDB
      if (error.message.includes('duplicate key') || error.message.includes('E11000')) {
        console.log('🔍 El error es de clave duplicada en MongoDB');
        
        // Verificar documentos actuales
        const db = mongoose.connection.db;
        const usuariosCollection = db.collection('usuarios');
        const docs = await usuariosCollection.find({}).toArray();
        console.log('📋 Documentos actuales en MongoDB:');
        docs.forEach(doc => {
          console.log(`  - ID: ${doc._id}, idKeycloak: ${doc.idKeycloak}, email: ${doc.email}`);
        });
        
        // Verificar índices
        const indexes = await usuariosCollection.listIndexes();
        console.log('📋 Índices actuales:');
        indexes.forEach(index => {
          console.log(`  - ${index.name}: ${JSON.stringify(index.key)}`);
        });
      }
    }
    
  } catch (error) {
    console.error('❌ Error en la prueba:', error);
  } finally {
    await mongoose.disconnect();
  }
}

// Ejecutar la prueba
testUserCreation();
