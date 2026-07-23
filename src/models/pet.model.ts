import { Schema, model } from 'mongoose';
import { IPetDocument } from '../interfaces/pet.interface';

const PetSchema = new Schema<IPetDocument>(
  {
    nombre: { type: String, required: true, trim: true },
    especie: { type: String, required: true, trim: true },
    raza: { type: String, required: true, trim: true },
    sexo: { type: String, required: true, enum: ['Macho', 'Hembra'] },
    edad: { type: String, trim: true },
    fechaNacimiento: { type: Date, required: true },
    peso: { type: Number, required: true },
    color: { type: String, required: true, trim: true },
    observaciones: { type: String, default: '' },
    propietario: { type: Schema.Types.ObjectId, ref: 'Client', required: true, index: true },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export const PetModel = model<IPetDocument>('Pet', PetSchema);
