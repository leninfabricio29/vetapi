import { BaseRepository } from './base.repository';
import { IUserDocument } from '../interfaces/user.interface';
import { UserModel } from '../models/user.model';

export class UserRepository extends BaseRepository<IUserDocument> {
  constructor() {
    super(UserModel);
  }

  async findByEmail(email: string): Promise<IUserDocument | null> {
    return this.model.findOne({ email: email.toLowerCase() }).exec();
  }

  async findByUsername(usuario: string): Promise<IUserDocument | null> {
    return this.model.findOne({ usuario: usuario.toLowerCase() }).populate('veterinaria').exec();
  }
}
