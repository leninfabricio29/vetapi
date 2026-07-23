import { Router } from 'express';
import { CashRegisterController } from '../controllers/cashRegister.controller';
import { cashRegisterValidators, validateMongoId } from '../validators/schemas.validator';
import { validateRequest } from '../middlewares/validateRequest';
import { authenticateJWT, requireRoles } from '../middlewares/auth';
import { UserRole } from '../constants/roles';

const router = Router();
const controller = new CashRegisterController();

router.use(authenticateJWT, requireRoles(UserRole.ADMIN, UserRole.CASHIER));

router.post('/open', cashRegisterValidators.open, validateRequest, controller.openRegister);
router.get('/current', controller.getActiveRegister);
router.post('/close', cashRegisterValidators.close, validateRequest, controller.closeRegister);
router.post('/movements', cashRegisterValidators.manualMovement, validateRequest, controller.addManualMovement);
router.get('/movements/register/:cashRegisterId', validateMongoId('cashRegisterId'), validateRequest, controller.getMovementsByRegister);
router.get('/', controller.getAllRegisters);

export default router;
