import mongoose from 'mongoose';
import Notificacion from '../models/entities/Notificacion.js';

const notificacionSchema = new mongoose.Schema({
    // id: {
    //     type: String,
    //     required: true,
    //     unique: true
    // },
    usuario: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true,
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