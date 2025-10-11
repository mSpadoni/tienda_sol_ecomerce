import mongoose from 'mongoose';
import Notificacion from '../models/entities/Notificacion.js';

const notificacionSchema = new mongoose.Schema({
    id: {
        type: String,
        required: true,
        unique: true
    },
    usuario: {
        type: String,
        required: true,
        trim: true,
    },
    mensaje: { 
        type: String, 
        required: true 
    },
    fechaAlta: { 
        type: Date, 
        default: Date.now 
    },
    leida: {
        type: Boolean,
        default: false
    },
    fechaLeida: {
        type: Date,
        default: null
    }
},{
    timestamps: true,
    collection: 'notificaciones'
});

notificacionSchema.loadClass(Notificacion);

export const NotificacionModel = mongoose.model('Notificacion', notificacionSchema);