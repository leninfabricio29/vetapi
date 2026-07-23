import { Schema, model } from 'mongoose';
import { ICashRegisterDocument } from '../interfaces/cashRegister.interface';

const CashRegisterSchema = new Schema<ICashRegisterDocument>(
  {
    montoInicial: { type: Number, required: true, min: 0 },
    montoFinal: { type: Number, min: 0 },
    fechaApertura: { type: Date, required: true, default: Date.now },
    fechaCierre: { type: Date },
    usuario: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    ventas: { type: Number, required: true, default: 0 },
    ingresos: { type: Number, required: true, default: 0 },
    egresos: { type: Number, required: true, default: 0 },
    efectivoEsperado: { type: Number, required: true, default: 0 },
    efectivoContado: { type: Number },
    diferencia: { type: Number },
    estado: { type: String, required: true, enum: ['Abierta', 'Cerrada'], default: 'Abierta', index: true },
    veterinaria: { type: Schema.Types.ObjectId, ref: 'Veterinary', required: true },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export const CashRegisterModel = model<ICashRegisterDocument>('CashRegister', CashRegisterSchema);
