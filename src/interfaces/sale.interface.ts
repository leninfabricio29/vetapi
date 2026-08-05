import { Document, Types } from 'mongoose';

export type SaleItemType = 'Producto' | 'Servicio';
export type SaleStatus = 'Completada' | 'Anulada';
export type PaymentMethod = 'Efectivo' | 'Tarjeta' | 'Transferencia';

export interface ISaleItem {
  tipo: SaleItemType;
  producto?: Types.ObjectId | string;
  servicio?: Types.ObjectId | string;
  cantidad: number;
  precio: number;
  subtotal: number;
  comisiónPrincipal: number;
  comisiónSecundario: number;
  gananciaPrincipal: number;
  gananciaSecundario: number;
}

export interface ISale {
  cliente: Types.ObjectId | string;
  usuario: Types.ObjectId | string;
  caja: Types.ObjectId | string;
  fecha: Date;
  estado: SaleStatus;
  subtotal: number;
  iva: number;
  descuento: number;
  total: number;
  métodoPago: PaymentMethod;
  observaciones?: string;
  comprobanteUrl?: string;
  referenciaTransferencia?: string;
  gananciaPrincipal: number;
  gananciaSecundario: number;
  detalles: ISaleItem[];
  veterinaria: any;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ISaleDocument extends ISale, Document {}

export interface CreateSaleItemDto {
  tipo: SaleItemType;
  producto?: string;
  servicio?: string;
  cantidad: number;
  comisiónPrincipal?: number;
  comisiónSecundario?: number;
}

export interface CreateSaleDto {
  cliente: string;
  descuento?: number;
  métodoPago: PaymentMethod;
  observaciones?: string;
  comprobanteUrl?: string;
  referenciaTransferencia?: string;
  detalles: CreateSaleItemDto[];
}
