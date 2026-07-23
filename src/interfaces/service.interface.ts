import { Document } from 'mongoose';

export interface IService {
  nombre: string;
  descripción?: string;
  precio: number;
  duración: string; // e.g., "30 min", "1 hora"
  estado: 'Activo' | 'Inactivo';
  tieneIva: boolean;
  comisiónPrincipal?: number;
  comisiónSecundario?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IServiceDocument extends IService, Document {}

export interface CreateServiceDto {
  nombre: string;
  descripción?: string;
  precio: number;
  duración: string;
  estado?: 'Activo' | 'Inactivo';
  tieneIva?: boolean;
  comisiónPrincipal?: number;
  comisiónSecundario?: number;
}

export interface UpdateServiceDto {
  nombre?: string;
  descripción?: string;
  precio?: number;
  duración?: string;
  estado?: 'Activo' | 'Inactivo';
  tieneIva?: boolean;
  comisiónPrincipal?: number;
  comisiónSecundario?: number;
}
