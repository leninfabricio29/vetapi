import { Document } from 'mongoose';

export interface IVeterinary {
  nombre: string;
  RUC: string;
  dirección?: string;
  teléfono?: string;
  email: string;
  plan?: 'Básico' | 'Premium';
  preferencias?: {
    tema: string;
  };
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IVeterinaryDocument extends IVeterinary, Document {}
