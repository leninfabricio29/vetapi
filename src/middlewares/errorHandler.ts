import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/customErrors';
import { sendError } from '../utils/responseHelper';

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Log the error stack in dev
  console.error(`[Error Handler] ${err.name}: ${err.message}`);
  if (err.stack) {
    console.error(err.stack);
  }

  if (err instanceof AppError) {
    return sendError(res, err.message, err.errors, err.statusCode);
  }

  // Handle Mongoose validation errors
  if (err.name === 'ValidationError') {
    const errors = Object.values((err as any).errors).map((el: any) => ({
      field: el.path,
      message: el.message,
    }));
    return sendError(res, 'Error de validación de datos', errors, 400);
  }

  // Handle Mongoose cast errors (invalid ObjectId)
  if (err.name === 'CastError') {
    const errors = [{
      field: (err as any).path,
      message: `El valor '${(err as any).value}' no es un ID de Mongoose válido.`
    }];
    return sendError(res, 'Formato de ID inválido', errors, 400);
  }

  // Handle MongoDB duplicate key errors
  if ((err as any).code === 11000) {
    const field = Object.keys((err as any).keyValue)[0];
    const value = (err as any).keyValue[field];
    const errors = [{
      field,
      message: `El valor '${value}' ya se encuentra registrado.`
    }];
    return sendError(res, 'Registro duplicado', errors, 409);
  }

  // Handle JWT errors
  if (err.name === 'JsonWebTokenError') {
    return sendError(res, 'Token de autenticación inválido', [], 401);
  }
  if (err.name === 'TokenExpiredError') {
    return sendError(res, 'El token de autenticación ha expirado', [], 401);
  }

  // Generic internal server error
  return sendError(
    res,
    process.env.NODE_ENV === 'production' ? 'Ha ocurrido un error interno en el servidor' : err.message,
    [],
    500
  );
};
