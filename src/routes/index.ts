import { Router } from 'express';
import authRoutes from './auth.routes';
import userRoutes from './user.routes';
import clientRoutes from './client.routes';
import categoryRoutes from './category.routes';
import productRoutes from './product.routes';
import inventoryRoutes from './inventory.routes';
import cashRegisterRoutes from './cashRegister.routes';
import saleRoutes from './sale.routes';
import reportRoutes from './report.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/clients', clientRoutes);
router.use('/categories', categoryRoutes);
router.use('/products', productRoutes);
router.use('/inventory', inventoryRoutes);
router.use('/cash-registers', cashRegisterRoutes);
router.use('/sales', saleRoutes);
router.use('/reports', reportRoutes);

export default router;
