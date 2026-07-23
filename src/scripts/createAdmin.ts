import mongoose from 'mongoose';
import { connectDB } from '../database/connection';
import { UserModel } from '../models/user.model';
import { UserRole } from '../constants/roles';
import { env } from '../config/env';

const createAdmin = async () => {
  try {
    await connectDB();

    const existing = await UserModel.findOne({ usuario: env.ADMIN_INITIAL_USER.toLowerCase() });
    if (existing) {
      console.log(`El usuario administrador '${env.ADMIN_INITIAL_USER}' ya existe.`);
      process.exit(0);
    }

    const admin = new UserModel({
      nombres: 'Administrador',
      apellidos: 'Sistema',
      email: env.ADMIN_INITIAL_EMAIL,
      teléfono: '0999999999',
      usuario: env.ADMIN_INITIAL_USER,
      contraseña: env.ADMIN_INITIAL_PASSWORD,
      rol: UserRole.ADMIN,
      estado: 'Activo',
    });

    await admin.save();
    console.log(`Usuario administrador creado exitosamente.`);
    console.log(`Usuario: ${env.ADMIN_INITIAL_USER}`);
    console.log(`Contraseña: ${env.ADMIN_INITIAL_PASSWORD}`);
    console.log(`Email: ${env.ADMIN_INITIAL_EMAIL}`);
  } catch (error) {
    console.error('Error al crear el administrador inicial:', error);
  } finally {
    await mongoose.connection.close();
    console.log('Conexión a la base de datos cerrada.');
  }
};

createAdmin();
