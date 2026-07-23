import { Schema, model } from 'mongoose';
import { IProductDocument } from '../interfaces/product.interface';

const ProductSchema = new Schema<IProductDocument>(
  {
    código: { type: String, required: true, index: true, trim: true },
    nombre: { type: String, required: true, trim: true },
    descripción: { type: String, default: '' },
    categoría: { type: Schema.Types.ObjectId, ref: 'Category', required: true, index: true },
    precioCompra: { type: Number, required: true, min: 0 },
    precioVenta: { type: Number, required: true, min: 0 },
    stock: { type: Number, required: true, min: 0, default: 0 },
    stockMínimo: { type: Number, required: true, min: 0, default: 0 },
    unidad: { type: String, required: true, trim: true },
    proveedor: { type: String, required: true, trim: true },
    estado: { type: String, required: true, enum: ['Activo', 'Inactivo'], default: 'Activo' },
    tieneIva: { type: Boolean, default: false },
    comisiónPrincipal: { type: Number, min: 0, max: 100 },
    comisiónSecundario: { type: Number, min: 0, max: 100 },
    veterinaria: { type: Schema.Types.ObjectId, ref: 'Veterinary', required: true },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

ProductSchema.index({ código: 1, veterinaria: 1 }, { unique: true });

export const ProductModel = model<IProductDocument>('Product', ProductSchema);
