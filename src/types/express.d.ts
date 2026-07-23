import { UserRole } from '../constants/roles';

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        usuario: string;
        rol: UserRole;
        email: string;
        veterinaria: string;
      };
    }
  }
}
