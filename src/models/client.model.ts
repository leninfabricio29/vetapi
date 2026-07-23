import { Schema, model } from 'mongoose';
import { IClientDocument } from '../interfaces/client.interface';

const ClientSchema = new Schema<IClientDocument>(
  {
    nombres: { type: String, required: true, trim: true },
    apellidos: { type: String, required: true, trim: true },
    cédula: { type: String, required: true, index: true, trim: true },
    teléfono: { type: String, required: true, trim: true },
    email: { type: String, required: true, index: true, lowercase: true, trim: true },
    dirección: { type: String, required: true, trim: true },
    observaciones: { type: String, default: '' },
    estado: { type: String, required: true, enum: ['Activo', 'Inactivo'], default: 'Activo' },
    veterinaria: { type: Schema.Types.ObjectId, ref: 'Veterinary', required: true },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

ClientSchema.index({ cédula: 1, veterinaria: 1 }, { unique: true });
ClientSchema.index({ email: 1, veterinaria: 1 }, { unique: true });

export const ClientModel = model<IClientDocument>('Client', ClientSchema);
