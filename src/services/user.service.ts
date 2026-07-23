import { UserRepository } from '../repositories/user.repository';
import { CreateUserDto, UpdateUserDto, IUserDocument } from '../interfaces/user.interface';
import { ConflictError, NotFoundError } from '../utils/customErrors';
import bcrypt from 'bcrypt';

export class UserService {
  private userRepository: UserRepository;

  constructor() {
    this.userRepository = new UserRepository();
  }

  async createUser(data: CreateUserDto): Promise<IUserDocument> {
    const existingEmail = await this.userRepository.findByEmail(data.email);
    if (existingEmail) {
      throw new ConflictError('El correo electrónico ya está registrado.');
    }

    const existingUsername = await this.userRepository.findByUsername(data.usuario);
    if (existingUsername) {
      throw new ConflictError('El nombre de usuario ya está en uso.');
    }

    return this.userRepository.create(data);
  }

  async getAllUsers(): Promise<IUserDocument[]> {
    return this.userRepository.find({});
  }

  async getUserById(id: string): Promise<IUserDocument> {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new NotFoundError('Usuario no encontrado.');
    }
    return user;
  }

  async updateUser(id: string, data: UpdateUserDto): Promise<IUserDocument> {
    const user = await this.getUserById(id);

    if (data.email && data.email.toLowerCase() !== user.email.toLowerCase()) {
      const existingEmail = await this.userRepository.findByEmail(data.email);
      if (existingEmail) {
        throw new ConflictError('El correo electrónico ya está registrado.');
      }
    }

    if (data.usuario && data.usuario.toLowerCase() !== user.usuario.toLowerCase()) {
      const existingUsername = await this.userRepository.findByUsername(data.usuario);
      if (existingUsername) {
        throw new ConflictError('El nombre de usuario ya está en uso.');
      }
    }

    // Hash password if modifying
    if (data.contraseña) {
      const salt = await bcrypt.genSalt(10);
      data.contraseña = await bcrypt.hash(data.contraseña, salt);
    }

    const updatedUser = await this.userRepository.update(id, data);
    if (!updatedUser) {
      throw new NotFoundError('Usuario no encontrado para actualizar.');
    }
    return updatedUser;
  }

  async deleteUser(id: string): Promise<IUserDocument> {
    await this.getUserById(id);
    const deleted = await this.userRepository.delete(id);
    if (!deleted) {
      throw new NotFoundError('Usuario no encontrado para eliminar.');
    }
    return deleted;
  }
}
