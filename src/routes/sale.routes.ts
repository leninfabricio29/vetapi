import { Router } from 'express';
import multer from 'multer';
import { SaleController } from '../controllers/sale.controller';
import { saleValidators, validateMongoId } from '../validators/schemas.validator';
import { validateRequest } from '../middlewares/validateRequest';
import { authenticateJWT, requireRoles } from '../middlewares/auth';
import { UserRole } from '../constants/roles';

const router = Router();
const controller = new SaleController();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

router.use(authenticateJWT, requireRoles(UserRole.ADMIN, UserRole.CASHIER));

router.post('/upload-receipt', upload.single('comprobante'), controller.uploadReceipt);
router.post('/', saleValidators.create, validateRequest, controller.createSale);
router.get('/', controller.getAllSales);
router.get('/:id', validateMongoId('id'), validateRequest, controller.getSaleById);
router.post('/:id/annul', validateMongoId('id'), validateRequest, controller.annulSale);

export default router;
