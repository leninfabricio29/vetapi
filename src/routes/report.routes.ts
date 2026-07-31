import { Router } from 'express';
import { ReportController } from '../controllers/report.controller';
import { validateMongoId } from '../validators/schemas.validator';
import { validateRequest } from '../middlewares/validateRequest';
import { authenticateJWT, requireRoles } from '../middlewares/auth';
import { UserRole } from '../constants/roles';

const router = Router();
const controller = new ReportController();

router.use(authenticateJWT, requireRoles(UserRole.ADMIN));

router.get('/sales', controller.getSalesByDate);
router.get('/sales/client/:clientId', validateMongoId('clientId'), validateRequest, controller.getSalesByClient);
router.get('/sales/user/:userId', validateMongoId('userId'), validateRequest, controller.getSalesByUser);
router.get('/sales/product/:productId', validateMongoId('productId'), validateRequest, controller.getSalesByProduct);
router.get('/low-stock', controller.getLowStockProducts);
router.get('/top-products', controller.getTopSellingProducts);
router.get('/cash-flow', controller.getCashFlowSummary);
router.get('/inventory-movements', controller.getInventoryMovements);
router.get('/operational-costs', controller.getOperationalCosts);

export default router;
