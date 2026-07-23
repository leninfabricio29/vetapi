import { BaseRepository } from './base.repository';
import { IClientDocument } from '../interfaces/client.interface';
import { ClientModel } from '../models/client.model';

export class ClientRepository extends BaseRepository<IClientDocument> {
  constructor() {
    super(ClientModel);
  }

  async findByCédula(cédula: string): Promise<IClientDocument | null> {
    return this.model.findOne(this.getQueryFilter({ cédula })).exec();
  }

  async findByEmail(email: string): Promise<IClientDocument | null> {
    return this.model.findOne(this.getQueryFilter({ email: email.toLowerCase() })).exec();
  }

  async search(query: string): Promise<IClientDocument[]> {
    const searchRegex = new RegExp(query, 'i');
    return this.model.find(this.getQueryFilter({
      $or: [
        { nombres: searchRegex },
        { apellidos: searchRegex },
        { cédula: searchRegex },
        { teléfono: searchRegex },
        { email: searchRegex }
      ]
    })).exec();
  }
}
