import { Router } from 'express';
import { PetController } from '../controllers/pet.controller';
import { petValidators, validateMongoId } from '../validators/schemas.validator';
import { validateRequest } from '../middlewares/validateRequest';
import { authenticateJWT, requireRoles } from '../middlewares/auth';
import { UserRole } from '../constants/roles';

const router = Router();
const controller = new PetController();

router.use(authenticateJWT, requireRoles(UserRole.ADMIN, UserRole.VETERINARIAN, UserRole.RECEPTIONIST));

router.post('/', petValidators.create, validateRequest, controller.createPet);
router.get('/', controller.getAllPets);
router.get('/:id', validateMongoId('id'), validateRequest, controller.getPetById);
router.get('/owner/:clientId', validateMongoId('clientId'), validateRequest, controller.getPetsByOwner);
router.put('/:id', validateMongoId('id'), petValidators.update, validateRequest, controller.updatePet);
router.delete('/:id', validateMongoId('id'), validateRequest, controller.deletePet);

export default router;
