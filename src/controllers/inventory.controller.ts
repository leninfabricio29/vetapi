import { Request, Response, NextFunction } from 'express';
import { InventoryService } from '../services/inventory.service';
import { sendSuccess } from '../utils/responseHelper';

export class InventoryController {
  private inventoryService: InventoryService;

  constructor() {
    this.inventoryService = new InventoryService();
  }

  getAllMovements = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const movements = await this.inventoryService.getAllMovements();
      return sendSuccess(res, 'Movimientos de inventario obtenidos exitosamente.', movements);
    } catch (error) {
      next(error);
    }
  };

  getMovementsByProduct = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const movements = await this.inventoryService.getMovementsByProduct(req.params.productId);
      return sendSuccess(res, 'Movimientos de inventario por producto obtenidos exitosamente.', movements);
    } catch (error) {
      next(error);
    }
  };
}
