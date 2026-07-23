import { BaseRepository } from './base.repository';
import { IServiceDocument } from '../interfaces/service.interface';
import { ServiceModel } from '../models/service.model';

export class ServiceRepository extends BaseRepository<IServiceDocument> {
  constructor() {
    super(ServiceModel);
  }

  async findByName(name: string): Promise<IServiceDocument | null> {
    return this.model.findOne({ nombre: { $regex: new RegExp(`^${name}$`, 'i') } }).exec();
  }
}
