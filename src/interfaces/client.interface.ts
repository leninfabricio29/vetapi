import { Document } from 'mongoose';

export interface IClient {
  nombres: string;
  apellidos: string;
  cédula: string;
  teléfono: string;
  email: string;
  dirección: string;
  observaciones?: string;
  estado: 'Activo' | 'Inactivo';
  veterinaria: any;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IClientDocument extends IClient, Document {}

export interface CreateClientDto {
  nombres: string;
  apellidos: string;
  cédula: string;
  teléfono: string;
  email: string;
  dirección: string;
  observaciones?: string;
  estado?: 'Activo' | 'Inactivo';
}

export interface UpdateClientDto {
  nombres?: string;
  apellidos?: string;
  cédula?: string;
  teléfono?: string;
  email?: string;
  dirección?: string;
  observaciones?: string;
  estado?: 'Activo' | 'Inactivo';
}
