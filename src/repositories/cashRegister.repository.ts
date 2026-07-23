import { BaseRepository } from './base.repository';
import { ICashRegisterDocument } from '../interfaces/cashRegister.interface';
import { CashRegisterModel } from '../models/cashRegister.model';

export class CashRegisterRepository extends BaseRepository<ICashRegisterDocument> {
  constructor() {
    super(CashRegisterModel);
  }

  async findActiveRegister(userId: string): Promise<ICashRegisterDocument | null> {
    return this.model.findOne(this.getQueryFilter({ usuario: userId, estado: 'Abierta' })).exec();
  }

  async findWithDetails(filter: any = {}): Promise<ICashRegisterDocument[]> {
    return this.model.find(this.getQueryFilter(filter)).populate('usuario', 'nombres apellidos usuario rol').sort({ fechaApertura: -1 }).exec();
  }

  async findByIdWithDetails(id: string): Promise<ICashRegisterDocument | null> {
    return this.model.findOne(this.getQueryFilter({ _id: id })).populate('usuario', 'nombres apellidos usuario rol').exec();
  }
}
