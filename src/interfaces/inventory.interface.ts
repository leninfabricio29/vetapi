import { Document, Types } from 'mongoose';

export type InventoryMovementType = 'Ingreso' | 'Salida' | 'Ajuste' | 'Venta' | 'Compra';

export interface IInventoryMovement {
  fecha: Date;
  usuario: Types.ObjectId | string;
  producto: Types.ObjectId | string;
  cantidad: number;
  stockAnterior: number;
  stockNuevo: number;
  motivo: string;
  tipo: InventoryMovementType;
  veterinaria: any;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IInventoryMovementDocument extends IInventoryMovement, Document {}

export interface CreateInventoryMovementDto {
  usuario: string;
  producto: string;
  cantidad: number;
  stockAnterior: number;
  stockNuevo: number;
  motivo: string;
  tipo: InventoryMovementType;
}
