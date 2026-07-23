import { Document, Types } from 'mongoose';

export interface IPet {
  nombre: string;
  especie: string;
  raza: string;
  sexo: 'Macho' | 'Hembra';
  edad?: string;
  fechaNacimiento: Date;
  peso: number;
  color: string;
  observaciones?: string;
  propietario: Types.ObjectId | string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IPetDocument extends IPet, Document {}

export interface CreatePetDto {
  nombre: string;
  especie: string;
  raza: string;
  sexo: 'Macho' | 'Hembra';
  edad?: string;
  fechaNacimiento: string | Date;
  peso: number;
  color: string;
  observaciones?: string;
  propietario: string;
}

export interface UpdatePetDto {
  nombre?: string;
  especie?: string;
  raza?: string;
  sexo?: 'Macho' | 'Hembra';
  edad?: string;
  fechaNacimiento?: string | Date;
  peso?: number;
  color?: string;
  observaciones?: string;
  propietario?: string;
}
