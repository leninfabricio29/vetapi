import { Document, Types } from 'mongoose';

export type CashMovementType = 'Ingreso' | 'Egreso';

export interface ICashMovement {
  tipo: CashMovementType;
  concepto: string; // e.g., "Venta", "Egreso Manual", "Ingreso Manual"
  descripción?: string;
  monto: number;
  usuario: Types.ObjectId | string;
  caja: Types.ObjectId | string;
  veterinaria: any;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ICashMovementDocument extends ICashMovement, Document {}

export interface CreateCashMovementDto {
  tipo: CashMovementType;
  concepto: string;
  descripción?: string;
  monto: number;
  usuario: string;
  caja: string;
}
