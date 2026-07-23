import { Schema, model } from 'mongoose';
import { IServiceDocument } from '../interfaces/service.interface';

const ServiceSchema = new Schema<IServiceDocument>(
  {
    nombre: { type: String, required: true, unique: true, index: true, trim: true },
    descripción: { type: String, default: '' },
    precio: { type: Number, required: true, min: 0 },
    duración: { type: String, required: true, trim: true },
    estado: { type: String, required: true, enum: ['Activo', 'Inactivo'], default: 'Activo' },
    tieneIva: { type: Boolean, default: false },
    comisiónPrincipal: { type: Number, default: 100, min: 0, max: 100 },
    comisiónSecundario: { type: Number, default: 0, min: 0, max: 100 },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export const ServiceModel = model<IServiceDocument>('Service', ServiceSchema);
