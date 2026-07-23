import { Schema, model } from 'mongoose';
import { IInventoryMovementDocument } from '../interfaces/inventory.interface';

const InventoryMovementSchema = new Schema<IInventoryMovementDocument>(
  {
    fecha: { type: Date, default: Date.now, required: true, index: true },
    usuario: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    producto: { type: Schema.Types.ObjectId, ref: 'Product', required: true, index: true },
    cantidad: { type: Number, required: true },
    stockAnterior: { type: Number, required: true },
    stockNuevo: { type: Number, required: true },
    motivo: { type: String, required: true, trim: true },
    tipo: {
      type: String,
      required: true,
      enum: ['Ingreso', 'Salida', 'Ajuste', 'Venta', 'Compra'],
      index: true
    },
    veterinaria: { type: Schema.Types.ObjectId, ref: 'Veterinary', required: true },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export const InventoryMovementModel = model<IInventoryMovementDocument>('InventoryMovement', InventoryMovementSchema);
