import { Request, Response, NextFunction } from 'express';
import { ServiceService } from '../services/service.service';
import { sendSuccess } from '../utils/responseHelper';

export class ServiceController {
  private serviceService: ServiceService;

  constructor() {
    this.serviceService = new ServiceService();
  }

  createService = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const service = await this.serviceService.createService(req.body);
      return sendSuccess(res, 'Servicio registrado exitosamente.', service, 201);
    } catch (error) {
      next(error);
    }
  };

  getAllServices = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const services = await this.serviceService.getAllServices();
      return sendSuccess(res, 'Servicios obtenidos exitosamente.', services);
    } catch (error) {
      next(error);
    }
  };

  getServiceById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const service = await this.serviceService.getServiceById(req.params.id);
      return sendSuccess(res, 'Servicio obtenido exitosamente.', service);
    } catch (error) {
      next(error);
    }
  };

  updateService = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const service = await this.serviceService.updateService(req.params.id, req.body);
      return sendSuccess(res, 'Servicio actualizado exitosamente.', service);
    } catch (error) {
      next(error);
    }
  };

  deleteService = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const service = await this.serviceService.deleteService(req.params.id);
      return sendSuccess(res, 'Servicio eliminado exitosamente.', service);
    } catch (error) {
      next(error);
    }
  };
}
