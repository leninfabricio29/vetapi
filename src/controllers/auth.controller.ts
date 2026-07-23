import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/auth.service';
import { sendSuccess } from '../utils/responseHelper';

export class AuthController {
  private authService: AuthService;

  constructor() {
    this.authService = new AuthService();
  }

  register = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await this.authService.register(req.body);
      return sendSuccess(res, 'Veterinaria y Administrador registrados de forma exitosa. Contraseña enviada por correo.', data, 201);
    } catch (error) {
      next(error);
    }
  };

  login = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { usuario, contraseña } = req.body;
      const data = await this.authService.login(usuario, contraseña);
      return sendSuccess(res, 'Inicio de sesión exitoso.', data);
    } catch (error) {
      next(error);
    }
  };

  logout = async (req: Request, res: Response, next: NextFunction) => {
    try {
      return sendSuccess(res, 'Cierre de sesión exitoso.');
    } catch (error) {
      next(error);
    }
  };

  changePassword = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user!.id;
      const { contraseñaActual, contraseñaNueva } = req.body;
      await this.authService.changePassword(userId, contraseñaActual, contraseñaNueva);
      return sendSuccess(res, 'Contraseña cambiada exitosamente.');
    } catch (error) {
      next(error);
    }
  };

  recoverPassword = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email } = req.body;
      console.log(`[Recuperar Contraseña] Mocking password reset email to: ${email}`);
      return sendSuccess(res, `Se han enviado las instrucciones de recuperación al correo: ${email}.`);
    } catch (error) {
      next(error);
    }
  };

  getProfile = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user!.id;
      const data = await this.authService.getProfile(userId);
      return sendSuccess(res, 'Perfil obtenido exitosamente.', data);
    } catch (error) {
      next(error);
    }
  };

  updateProfile = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user!.id;
      const data = await this.authService.updateProfile(userId, req.body);
      return sendSuccess(res, 'Perfil actualizado exitosamente.', data);
    } catch (error) {
      next(error);
    }
  };

  updateVeterinary = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user!.id;
      const activeTenantId = req.user!.veterinaria;
      const rol = req.user!.rol;
      const data = await this.authService.updateVeterinary(userId, activeTenantId, rol, req.body);
      return sendSuccess(res, 'Datos de la clínica veterinaria actualizados exitosamente.', data);
    } catch (error) {
      next(error);
    }
  };
}
