import { BaseRepository } from './base.repository';
import { ICashMovementDocument } from '../interfaces/cashMovement.interface';
import { CashMovementModel } from '../models/cashMovement.model';

export class CashMovementRepository extends BaseRepository<ICashMovementDocument> {
  constructor() {
    super(CashMovementModel);
  }

  async findByRegister(cashRegisterId: string): Promise<ICashMovementDocument[]> {
    return this.model
      .find(this.getQueryFilter({ caja: cashRegisterId }))
      .populate('usuario', 'nombres apellidos usuario rol')
      .sort({ createdAt: -1 })
      .exec();
  }

  async findWithDetails(filter: any = {}): Promise<ICashMovementDocument[]> {
    return this.model
      .find(this.getQueryFilter(filter))
      .populate('usuario', 'nombres apellidos usuario rol')
      .populate('caja')
      .sort({ createdAt: -1 })
      .exec();
  }
}
