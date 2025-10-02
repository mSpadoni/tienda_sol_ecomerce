import mongoose from 'mongoose';
import Notificacion from '../models/entities/Notificacion.js';

const notificacionSchema = new mongoose.Schema({
    titulo: { 
        type: String, 
        required: true,
        trim: true,
    },
    mensaje: { 
        type: String, 
        required: true 
    },
    fecha: { 
        type: Date, 
        default: Date.now 
    },
},{
    timestamps: true,
    collection: 'notificaciones'
});

notificacionSchema.loadClass(Notificacion);

export const NotificacionModel = mongoose.model('Notificacion', notificacionSchema);