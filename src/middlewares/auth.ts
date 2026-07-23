import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/env';
import { UnauthorizedError, ForbiddenError } from '../utils/customErrors';
import { UserRole } from '../constants/roles';

import { tenantStore } from '../config/tenantContext';

export const authenticateJWT = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next(new UnauthorizedError('Acceso denegado: se requiere un token de autenticación.'));
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, env.JWT_SECRET) as any;
    req.user = {
      id: decoded.id,
      usuario: decoded.usuario,
      rol: decoded.rol as UserRole,
      email: decoded.email,
      veterinaria: decoded.veterinaria
    };
    if (decoded.veterinaria) {
      tenantStore.run({ veterinariaId: decoded.veterinaria }, () => {
        next();
      });
    } else {
      next();
    }
  } catch (error) {
    next(new UnauthorizedError('Sesión inválida o expirada. Loguéese nuevamente.'));
  }
};

export const requireRoles = (...allowedRoles: UserRole[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new UnauthorizedError('Acceso denegado: usuario no autenticado.'));
    }

    if (!allowedRoles.includes(req.user.rol)) {
      return next(new ForbiddenError('Acceso prohibido: no posee los permisos de rol requeridos para esta acción.'));
    }

    next();
  };
};
