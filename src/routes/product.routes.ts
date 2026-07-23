import { Router } from 'express';
import { ProductController } from '../controllers/product.controller';
import { productValidators, validateMongoId } from '../validators/schemas.validator';
import { validateRequest } from '../middlewares/validateRequest';
import { authenticateJWT, requireRoles } from '../middlewares/auth';
import { UserRole } from '../constants/roles';

const router = Router();
const controller = new ProductController();

router.use(authenticateJWT);

// Read endpoints
router.get('/', controller.getAllProducts);
router.get('/:id', validateMongoId('id'), validateRequest, controller.getProductById);

// Write endpoints (Restricted)
router.post('/', requireRoles(UserRole.ADMIN, UserRole.VETERINARIAN, UserRole.RECEPTIONIST), productValidators.create, validateRequest, controller.createProduct);
router.put('/:id', requireRoles(UserRole.ADMIN, UserRole.VETERINARIAN, UserRole.RECEPTIONIST), validateMongoId('id'), productValidators.update, validateRequest, controller.updateProduct);
router.delete('/:id', requireRoles(UserRole.ADMIN, UserRole.VETERINARIAN, UserRole.RECEPTIONIST), validateMongoId('id'), validateRequest, controller.deleteProduct);

export default router;
