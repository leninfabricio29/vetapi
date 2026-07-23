import { Router } from 'express';
import { UserController } from '../controllers/user.controller';
import { userValidators, validateMongoId } from '../validators/schemas.validator';
import { validateRequest } from '../middlewares/validateRequest';
import { authenticateJWT, requireRoles } from '../middlewares/auth';
import { UserRole } from '../constants/roles';

const router = Router();
const controller = new UserController();

router.use(authenticateJWT, requireRoles(UserRole.ADMIN));

router.post('/', userValidators.create, validateRequest, controller.createUser);
router.get('/', controller.getAllUsers);
router.get('/:id', validateMongoId('id'), validateRequest, controller.getUserById);
router.put('/:id', validateMongoId('id'), userValidators.update, validateRequest, controller.updateUser);
router.delete('/:id', validateMongoId('id'), validateRequest, controller.deleteUser);

export default router;
