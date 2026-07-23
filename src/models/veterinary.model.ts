import { Schema, model } from 'mongoose';
import { IVeterinaryDocument } from '../interfaces/veterinary.interface';

const VeterinarySchema = new Schema<IVeterinaryDocument>(
  {
    nombre: { type: String, required: true, trim: true },
    RUC: { type: String, required: true, unique: true, index: true, trim: true },
    dirección: { type: String, trim: true },
    teléfono: { type: String, trim: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    plan: { type: String, enum: ['Básico', 'Premium'], default: 'Básico' },
    preferencias: {
      tema: { type: String, default: 'default' }
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export const VeterinaryModel = model<IVeterinaryDocument>('Veterinary', VeterinarySchema);
