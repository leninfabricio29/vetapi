import { BaseRepository } from './base.repository';
import { IPetDocument } from '../interfaces/pet.interface';
import { PetModel } from '../models/pet.model';

export class PetRepository extends BaseRepository<IPetDocument> {
  constructor() {
    super(PetModel);
  }

  async findByOwner(clientId: string): Promise<IPetDocument[]> {
    return this.model.find({ propietario: clientId }).populate('propietario').exec();
  }

  async findWithPopulatedOwner(filter: any = {}): Promise<IPetDocument[]> {
    return this.model.find(filter).populate('propietario').exec();
  }

  async findByIdWithPopulatedOwner(id: string): Promise<IPetDocument | null> {
    return this.model.findById(id).populate('propietario').exec();
  }
}
