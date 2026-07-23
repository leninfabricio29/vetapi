import { InventoryMovementRepository } from '../repositories/inventory.repository';
import { IInventoryMovementDocument } from '../interfaces/inventory.interface';

export class InventoryService {
  private inventoryMovementRepository: InventoryMovementRepository;

  constructor() {
    this.inventoryMovementRepository = new InventoryMovementRepository();
  }

  async getAllMovements(): Promise<IInventoryMovementDocument[]> {
    return this.inventoryMovementRepository.findWithDetails({});
  }

  async getMovementsByProduct(productId: string): Promise<IInventoryMovementDocument[]> {
    return this.inventoryMovementRepository.findByProduct(productId);
  }
}
