import { Request, Response, NextFunction } from 'express';
import { SaleService } from '../services/sale.service';
import { CloudinaryService } from '../services/cloudinary.service';
import { sendSuccess } from '../utils/responseHelper';
import { BadRequestError } from '../utils/customErrors';

export class SaleController {
  private saleService: SaleService;
  private cloudinaryService: CloudinaryService;

  constructor() {
    this.saleService = new SaleService();
    this.cloudinaryService = new CloudinaryService();
  }

  createSale = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user!.id;
      const sale = await this.saleService.createSale(userId, req.body);
      return sendSuccess(res, 'Venta registrada y procesada exitosamente.', sale, 201);
    } catch (error) {
      next(error);
    }
  };

  getSaleById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const sale = await this.saleService.getSaleById(req.params.id);
      return sendSuccess(res, 'Venta obtenida exitosamente.', sale);
    } catch (error) {
      next(error);
    }
  };

  getAllSales = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const sales = await this.saleService.getAllSales();
      return sendSuccess(res, 'Ventas obtenidas exitosamente.', sales);
    } catch (error) {
      next(error);
    }
  };

  annulSale = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user!.id;
      const sale = await this.saleService.annulSale(userId, req.params.id);
      return sendSuccess(res, 'Venta anulada y stock devuelto exitosamente.', sale);
    } catch (error) {
      next(error);
    }
  };

  uploadReceipt = async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.file) {
        throw new BadRequestError('Debe proporcionar la imagen del comprobante de transferencia.');
      }
      const url = await this.cloudinaryService.uploadReceiptImage(req.file.buffer);
      return sendSuccess(res, 'Comprobante subido exitosamente a Cloudinary.', { url });
    } catch (error) {
      next(error);
    }
  };
}
