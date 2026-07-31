import { SaleRepository } from '../repositories/sale.repository';
import { ProductRepository } from '../repositories/product.repository';
import { InventoryMovementRepository } from '../repositories/inventory.repository';
import { CashMovementRepository } from '../repositories/cashMovement.repository';
import { SaleModel } from '../models/sale.model';
import { ISaleDocument } from '../interfaces/sale.interface';
import { IProductDocument } from '../interfaces/product.interface';
import { IInventoryMovementDocument } from '../interfaces/inventory.interface';
import { tenantStore } from '../config/tenantContext';
import mongoose from 'mongoose';

export class ReportService {
  private saleRepository: SaleRepository;
  private productRepository: ProductRepository;
  private inventoryMovementRepository: InventoryMovementRepository;
  private cashMovementRepository: CashMovementRepository;

  constructor() {
    this.saleRepository = new SaleRepository();
    this.productRepository = new ProductRepository();
    this.inventoryMovementRepository = new InventoryMovementRepository();
    this.cashMovementRepository = new CashMovementRepository();
  }

  async getSalesByDateRange(startDate: Date, endDate: Date, userId?: string): Promise<ISaleDocument[]> {
    // Adjust endDate to end of day (23:59:59.999 UTC) so sales made during
    // that day are included. Without this, "2026-07-31" becomes midnight UTC
    // and any sale recorded later that day would be excluded.
    const endOfDay = new Date(endDate);
    endOfDay.setUTCHours(23, 59, 59, 999);

    const filter: any = {
      fecha: { $gte: startDate, $lte: endOfDay }
    };
    if (userId) {
      filter.usuario = userId;
    }
    return this.saleRepository.findWithDetails(filter);
  }

  async getSalesByClient(clientId: string): Promise<ISaleDocument[]> {
    return this.saleRepository.findWithDetails({ cliente: clientId });
  }

  async getSalesByUser(userId: string): Promise<ISaleDocument[]> {
    return this.saleRepository.findWithDetails({ usuario: userId });
  }

  async getSalesByProduct(productId: string): Promise<ISaleDocument[]> {
    return this.saleRepository.findWithDetails({
      'detalles.producto': productId
    });
  }

  async getLowStockProducts(): Promise<IProductDocument[]> {
    return this.productRepository.findLowStock();
  }

  async getTopSellingProducts(limit: number = 5): Promise<any[]> {
    const context = tenantStore.getStore();
    const matchStage: any = { estado: 'Completada' };
    if (context?.veterinariaId) {
      matchStage.veterinaria = new mongoose.Types.ObjectId(context.veterinariaId);
    }
    return SaleModel.aggregate([
      { $match: matchStage },
      { $unwind: '$detalles' },
      { $match: { 'detalles.tipo': 'Producto' } },
      {
        $group: {
          _id: '$detalles.producto',
          cantidadVendida: { $sum: '$detalles.cantidad' },
          totalRecaudado: { $sum: '$detalles.subtotal' }
        }
      },
      { $sort: { cantidadVendida: -1 } },
      { $limit: limit },
      {
        $lookup: {
          from: 'products',
          localField: '_id',
          foreignField: '_id',
          as: 'producto'
        }
      },
      { $unwind: '$producto' }
    ]).exec();
  }

  async getCashFlowSummary(startDate?: Date, endDate?: Date): Promise<any> {
    const filter: any = {};
    if (startDate || endDate) {
      filter.createdAt = {};
      if (startDate) filter.createdAt.$gte = startDate;
      if (endDate) {
        const endOfDay = new Date(endDate);
        endOfDay.setUTCHours(23, 59, 59, 999);
        filter.createdAt.$lte = endOfDay;
      }
    }
    const movements = await this.cashMovementRepository.find(filter);
    let totalIngresos = 0;
    let totalEgresos = 0;
    for (const m of movements) {
      if (m.tipo === 'Ingreso') totalIngresos += m.monto;
      else totalEgresos += m.monto;
    }
    return {
      totalIngresos,
      totalEgresos,
      balance: totalIngresos - totalEgresos,
      movimientosCount: movements.length
    };
  }

  async getInventoryMovements(startDate?: Date, endDate?: Date): Promise<IInventoryMovementDocument[]> {
    const filter: any = {};
    if (startDate || endDate) {
      filter.fecha = {};
      if (startDate) filter.fecha.$gte = startDate;
      if (endDate) {
        const endOfDay = new Date(endDate);
        endOfDay.setUTCHours(23, 59, 59, 999);
        filter.fecha.$lte = endOfDay;
      }
    }
    return this.inventoryMovementRepository.findWithDetails(filter);
  }
}
