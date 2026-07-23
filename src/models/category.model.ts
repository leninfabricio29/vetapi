import { Schema, model } from 'mongoose';
import { ICategoryDocument } from '../interfaces/category.interface';

const CategorySchema = new Schema<ICategoryDocument>(
  {
    nombre: { type: String, required: true, index: true, trim: true },
    descripción: { type: String, default: '' },
    estado: { type: String, required: true, enum: ['Activo', 'Inactivo'], default: 'Activo' },
    comisiónPrincipal: { type: Number, default: 100, min: 0, max: 100 },
    comisiónSecundario: { type: Number, default: 0, min: 0, max: 100 },
    veterinaria: { type: Schema.Types.ObjectId, ref: 'Veterinary', required: true },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

CategorySchema.index({ nombre: 1, veterinaria: 1 }, { unique: true });

export const CategoryModel = model<ICategoryDocument>('Category', CategorySchema);
