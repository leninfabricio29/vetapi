import { Schema, model } from 'mongoose';
import { ICashMovementDocument } from '../interfaces/cashMovement.interface';

const CashMovementSchema = new Schema<ICashMovementDocument>(
  {
    tipo: { type: String, required: true, enum: ['Ingreso', 'Egreso'] },
    concepto: { type: String, required: true, trim: true },
    descripción: { type: String, default: '' },
    monto: { type: Number, required: true, min: 0 },
    usuario: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    caja: { type: Schema.Types.ObjectId, ref: 'CashRegister', required: true, index: true },
    veterinaria: { type: Schema.Types.ObjectId, ref: 'Veterinary', required: true },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export const CashMovementModel = model<ICashMovementDocument>('CashMovement', CashMovementSchema);
