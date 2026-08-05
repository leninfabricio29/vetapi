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

  private parseDateRange(startDateParam?: string | Date, endDateParam?: string | Date): { startDate: Date; endDate: Date } {
    let start: Date;
    let end: Date;

    if (startDateParam) {
      if (typeof startDateParam === 'string') {
        const datePart = startDateParam.split('T')[0];
        const [y, m, d] = datePart.split('-').map(Number);
        if (!isNaN(y) && !isNaN(m) && !isNaN(d)) {
          start = new Date(Date.UTC(y, m - 1, d, 0, 0, 0, 0));
        } else {
          start = new Date(startDateParam);
        }
      } else {
        start = new Date(startDateParam);
      }
    } else {
      start = new Date(0);
    }

    if (endDateParam) {
      if (typeof endDateParam === 'string') {
        const datePart = endDateParam.split('T')[0];
        const [y, m, d] = datePart.split('-').map(Number);
        if (!isNaN(y) && !isNaN(m) && !isNaN(d)) {
          // Add 1 day + 6 hours buffer (06:00:00 UTC of d+1) to ensure all sales
          // created during night/evening of day d in UTC-5 (America/Guayaquil) are matched.
          end = new Date(Date.UTC(y, m - 1, d + 1, 6, 0, 0, 0));
        } else {
          end = new Date(endDateParam);
          end.setUTCHours(23, 59, 59, 999);
        }
      } else {
        end = new Date(endDateParam);
        end.setUTCHours(23, 59, 59, 999);
      }
    } else {
      end = new Date();
      end.setUTCHours(23, 59, 59, 999);
    }

    return { startDate: start, endDate: end };
  }

  async getSalesByDateRange(startDateParam: string | Date, endDateParam: string | Date, userId?: string): Promise<ISaleDocument[]> {
    const { startDate, endDate } = this.parseDateRange(startDateParam, endDateParam);

    const filter: any = {
      fecha: { $gte: startDate, $lte: endDate }
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

  async getCashFlowSummary(startDateParam?: string | Date, endDateParam?: string | Date): Promise<any> {
    const filter: any = {};
    if (startDateParam || endDateParam) {
      const { startDate, endDate } = this.parseDateRange(startDateParam, endDateParam);
      filter.createdAt = { $gte: startDate, $lte: endDate };
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

  async getInventoryMovements(startDateParam?: string | Date, endDateParam?: string | Date): Promise<IInventoryMovementDocument[]> {
    const filter: any = {};
    if (startDateParam || endDateParam) {
      const { startDate, endDate } = this.parseDateRange(startDateParam, endDateParam);
      filter.fecha = { $gte: startDate, $lte: endDate };
    }
    return this.inventoryMovementRepository.findWithDetails(filter);
  }

  /**
   * Returns daily operational costs (costo de productos vendidos).
   * Cost = precioCompra × cantidad for each Producto line in completed sales.
   * Grouped by calendar day so the frontend can aggregate by week and month.
   */
  async getOperationalCosts(startDateParam: string | Date, endDateParam: string | Date): Promise<any[]> {
    const context = tenantStore.getStore();
    const { startDate, endDate } = this.parseDateRange(startDateParam, endDateParam);
    const timezone = process.env.TIMEZONE || 'America/Guayaquil';

    const matchStage: any = {
      fecha: { $gte: startDate, $lte: endDate },
      estado: 'Completada',
    };
    if (context?.veterinariaId) {
      matchStage.veterinaria = new mongoose.Types.ObjectId(context.veterinariaId);
    }

    return SaleModel.aggregate([
      { $match: matchStage },
      { $unwind: '$detalles' },
      { $match: { 'detalles.tipo': 'Producto' } },
      {
        $lookup: {
          from: 'products',
          localField: 'detalles.producto',
          foreignField: '_id',
          as: 'productoInfo',
        },
      },
      { $unwind: { path: '$productoInfo', preserveNullAndEmptyArrays: true } },
      {
        $project: {
          fecha: 1,
          nombreProducto: '$productoInfo.nombre',
          proveedor: '$productoInfo.proveedor',
          precioCompra: { $ifNull: ['$productoInfo.precioCompra', 0] },
          precioVenta: '$detalles.precio',
          cantidad: '$detalles.cantidad',
          costoLinea: {
            $multiply: [
              { $ifNull: ['$productoInfo.precioCompra', 0] },
              '$detalles.cantidad',
            ],
          },
          ventaLinea: '$detalles.subtotal',
        },
      },
      {
        $group: {
          _id: {
            year: { $year: { date: '$fecha', timezone } },
            month: { $month: { date: '$fecha', timezone } },
            day: { $dayOfMonth: { date: '$fecha', timezone } },
          },
          fecha: {
            $first: {
              $dateToString: {
                format: '%Y-%m-%d',
                date: '$fecha',
                timezone
              }
            }
          },
          costoTotal: { $sum: '$costoLinea' },
          ventaTotal: { $sum: '$ventaLinea' },
          unidadesVendidas: { $sum: '$cantidad' },
          detalle: {
            $push: {
              producto: '$nombreProducto',
              proveedor: '$proveedor',
              precioCompra: '$precioCompra',
              precioVenta: '$precioVenta',
              cantidad: '$cantidad',
              costoLinea: '$costoLinea',
              ventaLinea: '$ventaLinea',
            },
          },
        },
      },
      { $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 } },
    ]).exec();
  }
}
