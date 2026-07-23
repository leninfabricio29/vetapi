import jwt from 'jsonwebtoken';
import { UserRepository } from '../repositories/user.repository';
import { env } from '../config/env';
import { UnauthorizedError, NotFoundError, BadRequestError, ForbiddenError } from '../utils/customErrors';
import { VeterinaryModel } from '../models/veterinary.model';
import { UserModel } from '../models/user.model';
import { sendWelcomeEmail } from '../utils/email';
import { UserRole } from '../constants/roles';

export class AuthService {
  private userRepository: UserRepository;

  constructor() {
    this.userRepository = new UserRepository();
  }

  async register(data: any): Promise<any> {
    const {
      vetNombre,
      vetRUC,
      vetDirección,
      vetTeléfono,
      vetEmail,
      adminNombres,
      adminApellidos,
      adminEmail,
      adminUsuario,
      adminTeléfono
    } = data;

    const existingVet = await VeterinaryModel.findOne({ RUC: vetRUC });
    if (existingVet) {
      throw new BadRequestError('El RUC ingresado ya está registrado.');
    }

    const existingUser = await UserModel.findOne({
      $or: [
        { usuario: adminUsuario.toLowerCase() },
        { email: adminEmail.toLowerCase() }
      ]
    });
    if (existingUser) {
      throw new BadRequestError('El usuario o correo electrónico del administrador ya está en uso.');
    }

    const veterinary = await VeterinaryModel.create({
      nombre: vetNombre,
      RUC: vetRUC,
      dirección: vetDirección,
      teléfono: vetTeléfono,
      email: vetEmail
    });

    const contraseniaTemp = Math.random().toString(36).slice(-8) + 'V1!';

    const admin = await UserModel.create({
      nombres: adminNombres,
      apellidos: adminApellidos,
      email: adminEmail,
      teléfono: adminTeléfono,
      usuario: adminUsuario.toLowerCase(),
      contraseña: contraseniaTemp,
      rol: UserRole.ADMIN,
      estado: 'Activo',
      tipoComisión: 'Principal',
      veterinaria: veterinary._id
    });

    sendWelcomeEmail(
      adminEmail,
      `${adminNombres} ${adminApellidos}`,
      vetNombre,
      adminUsuario,
      contraseniaTemp
    );

    const adminObj = admin.toObject();
    delete (adminObj as any).contraseña;

    return {
      veterinaria: veterinary,
      administrador: adminObj
    };
  }

  async login(usuario: string, contrasenia: string): Promise<{ token: string; user: any }> {
    const user = await this.userRepository.findByUsername(usuario);
    if (!user) {
      throw new UnauthorizedError('Credenciales incorrectas (usuario o contraseña inválidos).');
    }

    if (user.estado === 'Inactivo') {
      throw new UnauthorizedError('Su cuenta se encuentra inactiva. Contacte al administrador.');
    }

    const isMatch = await user.comparePassword(contrasenia);
    if (!isMatch) {
      throw new UnauthorizedError('Credenciales incorrectas (usuario o contraseña inválidos).');
    }

    const token = jwt.sign(
      { id: user._id, usuario: user.usuario, rol: user.rol, email: user.email, veterinaria: user.veterinaria?._id || user.veterinaria },
      env.JWT_SECRET,
      { expiresIn: env.JWT_EXPIRES_IN as any }
    );

    const userObj = user.toObject();
    delete (userObj as any).contraseña;

    return { token, user: userObj };
  }

  async changePassword(userId: string, contraseniaActual: string, contraseniaNueva: string): Promise<void> {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new NotFoundError('Usuario no encontrado.');
    }

    const isMatch = await user.comparePassword(contraseniaActual);
    if (!isMatch) {
      throw new BadRequestError('La contraseña actual es incorrecta.');
    }

    user.contraseña = contraseniaNueva;
    await user.save();
  }

  async getProfile(userId: string): Promise<any> {
    const user = await this.userRepository.findOne({ _id: userId });
    if (!user) {
      throw new NotFoundError('Usuario no encontrado.');
    }
    const populated = await user.populate('veterinaria');
    const userObj = populated.toObject();
    delete (userObj as any).contraseña;
    return userObj;
  }

  async updateProfile(userId: string, data: any): Promise<any> {
    const user = await this.userRepository.findOne({ _id: userId });
    if (!user) {
      throw new NotFoundError('Usuario no encontrado.');
    }

    if (data.nombres !== undefined) user.nombres = data.nombres;
    if (data.apellidos !== undefined) user.apellidos = data.apellidos;
    if (data.email !== undefined) {
      const emailLower = data.email.toLowerCase().trim();
      const existingEmail = await UserModel.findOne({ email: emailLower, _id: { $ne: userId } });
      if (existingEmail) {
        throw new BadRequestError('El correo electrónico ya está en uso.');
      }
      user.email = emailLower;
    }
    if (data.teléfono !== undefined) user.teléfono = data.teléfono;
    if (data.usuario !== undefined) {
      const usernameLower = data.usuario.toLowerCase().trim();
      const existingUser = await UserModel.findOne({ usuario: usernameLower, _id: { $ne: userId } });
      if (existingUser) {
        throw new BadRequestError('El nombre de usuario ya está en uso.');
      }
      user.usuario = usernameLower;
    }

    await user.save();
    const populated = await user.populate('veterinaria');
    const userObj = populated.toObject();
    delete (userObj as any).contraseña;
    return userObj;
  }

  async updateVeterinary(userId: string, activeTenantId: string, rol: string, data: any): Promise<any> {
    if (rol !== UserRole.ADMIN) {
      throw new ForbiddenError('Solo el administrador de la clínica puede cambiar las preferencias de personalización.');
    }
    const vet = await VeterinaryModel.findById(activeTenantId);
    if (!vet) {
      throw new NotFoundError('Clínica veterinaria no encontrada.');
    }

    if (data.nombre !== undefined) vet.nombre = data.nombre;
    if (data.dirección !== undefined) vet.dirección = data.dirección;
    if (data.teléfono !== undefined) vet.teléfono = data.teléfono;
    if (data.email !== undefined) vet.email = data.email.toLowerCase();
    
    if (data.preferencias !== undefined && data.preferencias.tema !== undefined) {
      vet.preferencias = {
        tema: data.preferencias.tema
      };
    }

    await vet.save();
    return vet;
  }
}
