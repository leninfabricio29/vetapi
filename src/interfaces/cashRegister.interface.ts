import { Document, Types } from 'mongoose';

export type CashRegisterStatus = 'Abierta' | 'Cerrada';

export interface ICashRegister {
  montoInicial: number;
  montoFinal?: number;
  fechaApertura: Date;
  fechaCierre?: Date;
  usuario: Types.ObjectId | string;
  ventas: number;          // Total from sales (automatically calculated)
  ingresos: number;        // Total manual incomes
  egresos: number;         // Total manual expenses
  efectivoEsperado: number; // calculated: montoInicial + ventas + ingresos - egresos
  efectivoContado?: number; // input at close
  diferencia?: number;      // calculated: efectivoContado - efectivoEsperado
  estado: CashRegisterStatus;
  veterinaria: any;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ICashRegisterDocument extends ICashRegister, Document {}

export interface OpenCashRegisterDto {
  montoInicial: number;
}

export interface CloseCashRegisterDto {
  efectivoContado: number;
}
