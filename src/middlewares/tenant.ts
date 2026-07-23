import { Request, Response, NextFunction } from 'express';
import { tenantStore } from '../config/tenantContext';

export const tenantMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const veterinariaId = req.user?.veterinaria;
  if (!veterinariaId) {
    return next();
  }
  tenantStore.run({ veterinariaId }, () => {
    next();
  });
};
