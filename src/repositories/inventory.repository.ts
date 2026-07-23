import { BaseRepository } from './base.repository';
import { IInventoryMovementDocument } from '../interfaces/inventory.interface';
import { InventoryMovementModel } from '../models/inventory.model';

export class InventoryMovementRepository extends BaseRepository<IInventoryMovementDocument> {
  constructor() {
    super(InventoryMovementModel);
  }

  async findWithDetails(filter: any = {}): Promise<IInventoryMovementDocument[]> {
    return this.model
      .find(this.getQueryFilter(filter))
      .populate('usuario', 'nombres apellidos usuario rol')
      .populate('producto')
      .sort({ fecha: -1 })
      .exec();
  }

  async findByProduct(productId: string): Promise<IInventoryMovementDocument[]> {
    return this.findWithDetails({ producto: productId });
  }
}
