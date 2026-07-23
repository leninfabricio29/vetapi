import { Router } from 'express';
import { ServiceController } from '../controllers/service.controller';
import { serviceValidators, validateMongoId } from '../validators/schemas.validator';
import { validateRequest } from '../middlewares/validateRequest';
import { authenticateJWT, requireRoles } from '../middlewares/auth';
import { UserRole } from '../constants/roles';

const router = Router();
const controller = new ServiceController();

router.use(authenticateJWT);

// Read endpoints
router.get('/', controller.getAllServices);
router.get('/:id', validateMongoId('id'), validateRequest, controller.getServiceById);

// Write endpoints
router.post('/', requireRoles(UserRole.ADMIN, UserRole.VETERINARIAN, UserRole.RECEPTIONIST), serviceValidators.create, validateRequest, controller.createService);
router.put('/:id', requireRoles(UserRole.ADMIN, UserRole.VETERINARIAN, UserRole.RECEPTIONIST), validateMongoId('id'), serviceValidators.update, validateRequest, controller.updateService);
router.delete('/:id', requireRoles(UserRole.ADMIN, UserRole.VETERINARIAN, UserRole.RECEPTIONIST), validateMongoId('id'), validateRequest, controller.deleteService);

export default router;
