import { Router } from 'express';
import { CategoryController } from '../controllers/category.controller';
import { categoryValidators, validateMongoId } from '../validators/schemas.validator';
import { validateRequest } from '../middlewares/validateRequest';
import { authenticateJWT, requireRoles } from '../middlewares/auth';
import { UserRole } from '../constants/roles';

const router = Router();
const controller = new CategoryController();

router.use(authenticateJWT, requireRoles(UserRole.ADMIN, UserRole.VETERINARIAN, UserRole.RECEPTIONIST));

router.post('/', categoryValidators.create, validateRequest, controller.createCategory);
router.get('/', controller.getAllCategories);
router.get('/:id', validateMongoId('id'), validateRequest, controller.getCategoryById);
router.put('/:id', validateMongoId('id'), categoryValidators.update, validateRequest, controller.updateCategory);
router.delete('/:id', validateMongoId('id'), validateRequest, controller.deleteCategory);

export default router;
