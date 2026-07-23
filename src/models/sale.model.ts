import { Schema, model } from 'mongoose';
import { ISaleDocument } from '../interfaces/sale.interface';
import './service.model';

const SaleItemSchema = new Schema(
  {
    tipo: { type: String, required: true, enum: ['Producto', 'Servicio'] },
    producto: { type: Schema.Types.ObjectId, ref: 'Product' },
    servicio: { type: Schema.Types.ObjectId, ref: 'Service' },
    cantidad: { type: Number, required: true, min: 1 },
    precio: { type: Number, required: true, min: 0 },
    subtotal: { type: Number, required: true, min: 0 },
    comisiónPrincipal: { type: Number, required: true, default: 100 },
    comisiónSecundario: { type: Number, required: true, default: 0 },
    gananciaPrincipal: { type: Number, required: true, default: 0 },
    gananciaSecundario: { type: Number, required: true, default: 0 },
  },
  { _id: false }
);

const SaleSchema = new Schema<ISaleDocument>(
  {
    cliente: { type: Schema.Types.ObjectId, ref: 'Client', required: true, index: true },
    usuario: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    caja: { type: Schema.Types.ObjectId, ref: 'CashRegister', required: true, index: true },
    fecha: { type: Date, required: true, default: Date.now, index: true },
    estado: { type: String, required: true, enum: ['Completada', 'Anulada'], default: 'Completada', index: true },
    subtotal: { type: Number, required: true, min: 0 },
    iva: { type: Number, required: true, min: 0 },
    descuento: { type: Number, required: true, default: 0, min: 0 },
    total: { type: Number, required: true, min: 0 },
    métodoPago: { type: String, required: true, enum: ['Efectivo', 'Tarjeta', 'Transferencia'] },
    observaciones: { type: String, default: '' },
    comprobanteUrl: { type: String, default: '' },
    referenciaTransferencia: { type: String, default: '' },
    gananciaPrincipal: { type: Number, required: true, default: 0 },
    gananciaSecundario: { type: Number, required: true, default: 0 },
    detalles: [SaleItemSchema],
    veterinaria: { type: Schema.Types.ObjectId, ref: 'Veterinary', required: true },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export const SaleModel = model<ISaleDocument>('Sale', SaleSchema);
