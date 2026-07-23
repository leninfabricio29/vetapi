import { Schema, model } from 'mongoose';
import bcrypt from 'bcrypt';
import { IUserDocument } from '../interfaces/user.interface';
import { UserRole } from '../constants/roles';

const UserSchema = new Schema<IUserDocument>(
  {
    nombres: { type: String, required: true, trim: true },
    apellidos: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, index: true, lowercase: true, trim: true },
    teléfono: { type: String, required: true, trim: true },
    usuario: { type: String, required: true, unique: true, index: true, lowercase: true, trim: true },
    contraseña: { type: String, required: true },
    rol: { type: String, required: true, enum: Object.values(UserRole) },
    estado: { type: String, required: true, enum: ['Activo', 'Inactivo'], default: 'Activo' },
    tipoComisión: { type: String, enum: ['Principal', 'Secundario'], default: 'Secundario' },
    veterinaria: { type: Schema.Types.ObjectId, ref: 'Veterinary', required: true },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// Hash password before saving
UserSchema.pre<IUserDocument>('save', async function (next) {
  if (!this.isModified('contraseña')) {
    return next();
  }
  try {
    const salt = await bcrypt.genSalt(10);
    this.contraseña = await bcrypt.hash(this.contraseña, salt);
    next();
  } catch (error: any) {
    next(error);
  }
});

// Compare password
UserSchema.methods.comparePassword = async function (password: string): Promise<boolean> {
  return bcrypt.compare(password, this.contraseña);
};

export const UserModel = model<IUserDocument>('User', UserSchema);
