import mongoose from 'mongoose';
import Producto from '../models/entities/Producto.js';

const productoSchema = new mongoose.Schema({
  vendedor: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Usuario', 
    required: true 
},
  nombre: { 
    type: String, 
    required: true 
},
  descripcion: { 
    type: String, 
    required: true 
},
  precio: { 
    type: Number, 
    required: true 
},
  categoria: { 
    type: String, 
    required: true 
},
  imagen: { 
    type: String, 
    required: true 
},
  fechaCreacion: { 
    type: Date, 
    default: Date.now
}
});


productoSchema.pre(/^find/, function(next) {
    this.populate('vendedor', '');
    next();
});


productoSchema.loadClass(Producto);

export const ProductoModel = mongoose.model('Producto', productoSchema);