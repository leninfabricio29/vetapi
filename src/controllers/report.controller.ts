import { Request, Response, NextFunction } from 'express';
import { ReportService } from '../services/report.service';
import { sendSuccess } from '../utils/responseHelper';
import { BadRequestError } from '../utils/customErrors';

export class ReportController {
  private reportService: ReportService;

  constructor() {
    this.reportService = new ReportService();
  }

  getSalesByDate = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { startDate, endDate, userId } = req.query;
      if (!startDate || !endDate) {
        throw new BadRequestError('Los parámetros startDate y endDate son obligatorios.');
      }
      const sales = await this.reportService.getSalesByDateRange(
        startDate as string,
        endDate as string,
        userId ? (userId as string) : undefined
      );
      return sendSuccess(res, 'Ventas por rango de fecha obtenidas exitosamente.', sales);
    } catch (error) {
      next(error);
    }
  };

  getSalesByClient = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const sales = await this.reportService.getSalesByClient(req.params.clientId);
      return sendSuccess(res, 'Ventas por cliente obtenidas exitosamente.', sales);
    } catch (error) {
      next(error);
    }
  };

  getSalesByUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const sales = await this.reportService.getSalesByUser(req.params.userId);
      return sendSuccess(res, 'Ventas por usuario obtenidas exitosamente.', sales);
    } catch (error) {
      next(error);
    }
  };

  getSalesByProduct = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const sales = await this.reportService.getSalesByProduct(req.params.productId);
      return sendSuccess(res, 'Ventas por producto obtenidas exitosamente.', sales);
    } catch (error) {
      next(error);
    }
  };

  getLowStockProducts = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const products = await this.reportService.getLowStockProducts();
      return sendSuccess(res, 'Productos con bajo stock obtenidos exitosamente.', products);
    } catch (error) {
      next(error);
    }
  };

  getTopSellingProducts = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 5;
      const products = await this.reportService.getTopSellingProducts(limit);
      return sendSuccess(res, 'Productos más vendidos obtenidos exitosamente.', products);
    } catch (error) {
      next(error);
    }
  };

  getCashFlowSummary = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { startDate, endDate } = req.query;
      const summary = await this.reportService.getCashFlowSummary(
        startDate ? (startDate as string) : undefined,
        endDate ? (endDate as string) : undefined
      );
      return sendSuccess(res, 'Resumen de flujo de caja obtenido exitosamente.', summary);
    } catch (error) {
      next(error);
    }
  };

  getInventoryMovements = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { startDate, endDate } = req.query;
      const movements = await this.reportService.getInventoryMovements(
        startDate ? (startDate as string) : undefined,
        endDate ? (endDate as string) : undefined
      );
      return sendSuccess(res, 'Reporte de movimientos de inventario obtenido exitosamente.', movements);
    } catch (error) {
      next(error);
    }
  };

  getOperationalCosts = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { startDate, endDate } = req.query;
      if (!startDate || !endDate) {
        throw new BadRequestError('Los parámetros startDate y endDate son obligatorios.');
      }
      const costs = await this.reportService.getOperationalCosts(
        startDate as string,
        endDate as string
      );
      return sendSuccess(res, 'Gastos operativos obtenidos exitosamente.', costs);
    } catch (error) {
      next(error);
    }
  };
}
