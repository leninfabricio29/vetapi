import { Document } from 'mongoose';
import { UserRole } from '../constants/roles';

export interface IUser {
  nombres: string;
  apellidos: string;
  email: string;
  teléfono: string;
  usuario: string;
  contraseña: string;
  rol: UserRole;
  estado: 'Activo' | 'Inactivo';
  tipoComisión?: 'Principal' | 'Secundario';
  veterinaria: any;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IUserDocument extends IUser, Document {
  comparePassword(password: string): Promise<boolean>;
}

export interface CreateUserDto {
  nombres: string;
  apellidos: string;
  email: string;
  teléfono: string;
  usuario: string;
  contraseña: string;
  rol: UserRole;
  estado?: 'Activo' | 'Inactivo';
  tipoComisión?: 'Principal' | 'Secundario';
}

export interface UpdateUserDto {
  nombres?: string;
  apellidos?: string;
  email?: string;
  teléfono?: string;
  usuario?: string;
  contraseña?: string;
  rol?: UserRole;
  estado?: 'Activo' | 'Inactivo';
  tipoComisión?: 'Principal' | 'Secundario';
}
