import { Request, Response, NextFunction } from 'express';
import { ProductService } from '../services/product.service';
import { sendSuccess } from '../utils/responseHelper';

export class ProductController {
  private productService: ProductService;

  constructor() {
    this.productService = new ProductService();
  }

  createProduct = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user!.id;
      const product = await this.productService.createProduct(userId, req.body);
      return sendSuccess(res, 'Producto registrado exitosamente.', product, 201);
    } catch (error) {
      next(error);
    }
  };

  getAllProducts = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const products = await this.productService.getAllProducts();
      return sendSuccess(res, 'Productos obtenidos exitosamente.', products);
    } catch (error) {
      next(error);
    }
  };

  getProductById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const product = await this.productService.getProductById(req.params.id);
      return sendSuccess(res, 'Producto obtenido exitosamente.', product);
    } catch (error) {
      next(error);
    }
  };

  updateProduct = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user!.id;
      const product = await this.productService.updateProduct(userId, req.params.id, req.body);
      return sendSuccess(res, 'Producto actualizado exitosamente.', product);
    } catch (error) {
      next(error);
    }
  };

  deleteProduct = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const product = await this.productService.deleteProduct(req.params.id);
      return sendSuccess(res, 'Producto eliminado exitosamente.', product);
    } catch (error) {
      next(error);
    }
  };
}
