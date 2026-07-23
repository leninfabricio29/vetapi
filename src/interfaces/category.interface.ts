import { Document } from 'mongoose';

export interface ICategory {
  nombre: string;
  descripción?: string;
  estado: 'Activo' | 'Inactivo';
  comisiónPrincipal?: number;
  comisiónSecundario?: number;
  veterinaria: any;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ICategoryDocument extends ICategory, Document {}

export interface CreateCategoryDto {
  nombre: string;
  descripción?: string;
  estado?: 'Activo' | 'Inactivo';
  comisiónPrincipal?: number;
  comisiónSecundario?: number;
}

export interface UpdateCategoryDto {
  nombre?: string;
  descripción?: string;
  estado?: 'Activo' | 'Inactivo';
  comisiónPrincipal?: number;
  comisiónSecundario?: number;
}
