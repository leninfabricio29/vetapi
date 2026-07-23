import { Router } from 'express';
import { InventoryController } from '../controllers/inventory.controller';
import { validateMongoId } from '../validators/schemas.validator';
import { validateRequest } from '../middlewares/validateRequest';
import { authenticateJWT, requireRoles } from '../middlewares/auth';
import { UserRole } from '../constants/roles';

const router = Router();
const controller = new InventoryController();

router.use(authenticateJWT, requireRoles(UserRole.ADMIN, UserRole.VETERINARIAN, UserRole.RECEPTIONIST));

router.get('/', controller.getAllMovements);
router.get('/product/:productId', validateMongoId('productId'), validateRequest, controller.getMovementsByProduct);

export default router;
