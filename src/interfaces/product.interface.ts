import { Document, Types } from 'mongoose';

export interface IProduct {
  código: string;
  nombre: string;
  descripción?: string;
  categoría: Types.ObjectId | string;
  precioCompra: number;
  precioVenta: number;
  stock: number;
  stockMínimo: number;
  unidad: string;
  proveedor: string;
  estado: 'Activo' | 'Inactivo';
  tieneIva: boolean;
  comisiónPrincipal?: number;
  comisiónSecundario?: number;
  veterinaria: any;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IProductDocument extends IProduct, Document {}

export interface CreateProductDto {
  código: string;
  nombre: string;
  descripción?: string;
  categoría: string;
  precioCompra: number;
  precioVenta: number;
  stock: number;
  stockMínimo: number;
  unidad: string;
  proveedor: string;
  estado?: 'Activo' | 'Inactivo';
  tieneIva?: boolean;
  comisiónPrincipal?: number;
  comisiónSecundario?: number;
}

export interface UpdateProductDto {
  código?: string;
  nombre?: string;
  descripción?: string;
  categoría?: string;
  precioCompra?: number;
  precioVenta?: number;
  stock?: number;
  stockMínimo?: number;
  unidad?: string;
  proveedor?: string;
  estado?: 'Activo' | 'Inactivo';
  tieneIva?: boolean;
  comisiónPrincipal?: number;
  comisiónSecundario?: number;
}
