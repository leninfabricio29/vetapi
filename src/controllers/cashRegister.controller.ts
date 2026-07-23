import { Request, Response, NextFunction } from 'express';
import { CashRegisterService } from '../services/cashRegister.service';
import { sendSuccess } from '../utils/responseHelper';

export class CashRegisterController {
  private cashRegisterService: CashRegisterService;

  constructor() {
    this.cashRegisterService = new CashRegisterService();
  }

  openRegister = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user!.id;
      const register = await this.cashRegisterService.openRegister(userId, req.body);
      return sendSuccess(res, 'Caja abierta exitosamente.', register, 201);
    } catch (error) {
      next(error);
    }
  };

  getActiveRegister = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user!.id;
      const register = await this.cashRegisterService.getActiveRegister(userId);
      return sendSuccess(res, 'Caja activa obtenida exitosamente.', register);
    } catch (error) {
      next(error);
    }
  };

  closeRegister = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user!.id;
      const register = await this.cashRegisterService.closeRegister(userId, req.body);
      return sendSuccess(res, 'Caja cerrada exitosamente.', register);
    } catch (error) {
      next(error);
    }
  };

  addManualMovement = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user!.id;
      const { tipo, concepto, monto, descripción } = req.body;
      const movement = await this.cashRegisterService.addManualMovement(userId, tipo, concepto, monto, descripción);
      return sendSuccess(res, 'Movimiento de caja registrado exitosamente.', movement, 201);
    } catch (error) {
      next(error);
    }
  };

  getMovementsByRegister = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const movements = await this.cashRegisterService.getMovementsByRegister(req.params.cashRegisterId);
      return sendSuccess(res, 'Movimientos de la caja obtenidos exitosamente.', movements);
    } catch (error) {
      next(error);
    }
  };

  getAllRegisters = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const registers = await this.cashRegisterService.getAllRegisters();
      return sendSuccess(res, 'Historial de cajas obtenido exitosamente.', registers);
    } catch (error) {
      next(error);
    }
  };
}
