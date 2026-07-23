import { Request, Response, NextFunction } from 'express';
import { UserService } from '../services/user.service';
import { sendSuccess } from '../utils/responseHelper';

export class UserController {
  private userService: UserService;

  constructor() {
    this.userService = new UserService();
  }

  createUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = await this.userService.createUser(req.body);
      const userObj = user.toObject();
      delete (userObj as any).contraseña;
      return sendSuccess(res, 'Usuario registrado exitosamente.', userObj, 201);
    } catch (error) {
      next(error);
    }
  };

  getAllUsers = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const users = await this.userService.getAllUsers();
      const sanitizedUsers = users.map((u) => {
        const obj = u.toObject();
        delete (obj as any).contraseña;
        return obj;
      });
      return sendSuccess(res, 'Usuarios obtenidos exitosamente.', sanitizedUsers);
    } catch (error) {
      next(error);
    }
  };

  getUserById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = await this.userService.getUserById(req.params.id);
      const userObj = user.toObject();
      delete (userObj as any).contraseña;
      return sendSuccess(res, 'Usuario obtenido exitosamente.', userObj);
    } catch (error) {
      next(error);
    }
  };

  updateUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = await this.userService.updateUser(req.params.id, req.body);
      const userObj = user.toObject();
      delete (userObj as any).contraseña;
      return sendSuccess(res, 'Usuario actualizado exitosamente.', userObj);
    } catch (error) {
      next(error);
    }
  };

  deleteUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = await this.userService.deleteUser(req.params.id);
      const userObj = user.toObject();
      delete (userObj as any).contraseña;
      return sendSuccess(res, 'Usuario eliminado exitosamente.', userObj);
    } catch (error) {
      next(error);
    }
  };
}
