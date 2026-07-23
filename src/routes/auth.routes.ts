import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { authValidators } from '../validators/schemas.validator';
import { validateRequest } from '../middlewares/validateRequest';
import { authenticateJWT } from '../middlewares/auth';

const router = Router();
const controller = new AuthController();

router.post('/register', authValidators.register, validateRequest, controller.register);
router.post('/login', authValidators.login, validateRequest, controller.login);
router.post('/recover-password', controller.recoverPassword);
router.post('/logout', authenticateJWT, controller.logout);
router.get('/profile', authenticateJWT, controller.getProfile);
router.put('/profile', authenticateJWT, controller.updateProfile);
router.put('/veterinaria', authenticateJWT, controller.updateVeterinary);
router.post('/change-password', authenticateJWT, authValidators.changePassword, validateRequest, controller.changePassword);

export default router;
