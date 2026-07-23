import { Router } from 'express';
import { ClientController } from '../controllers/client.controller';
import { clientValidators, validateMongoId } from '../validators/schemas.validator';
import { validateRequest } from '../middlewares/validateRequest';
import { authenticateJWT, requireRoles } from '../middlewares/auth';
import { UserRole } from '../constants/roles';

const router = Router();
const controller = new ClientController();

router.use(authenticateJWT, requireRoles(UserRole.ADMIN, UserRole.VETERINARIAN, UserRole.RECEPTIONIST));

router.post('/', clientValidators.create, validateRequest, controller.createClient);
router.get('/', controller.getAllClients);
router.get('/:id', validateMongoId('id'), validateRequest, controller.getClientById);
router.put('/:id', validateMongoId('id'), clientValidators.update, validateRequest, controller.updateClient);
router.delete('/:id', validateMongoId('id'), validateRequest, controller.deleteClient);

export default router;
