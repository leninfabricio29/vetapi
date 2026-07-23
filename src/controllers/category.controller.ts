import { Request, Response, NextFunction } from 'express';
import { CategoryService } from '../services/category.service';
import { sendSuccess } from '../utils/responseHelper';

export class CategoryController {
  private categoryService: CategoryService;

  constructor() {
    this.categoryService = new CategoryService();
  }

  createCategory = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const category = await this.categoryService.createCategory(req.body);
      return sendSuccess(res, 'Categoría registrada exitosamente.', category, 201);
    } catch (error) {
      next(error);
    }
  };

  getAllCategories = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const categories = await this.categoryService.getAllCategories();
      return sendSuccess(res, 'Categorías obtenidas exitosamente.', categories);
    } catch (error) {
      next(error);
    }
  };

  getCategoryById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const category = await this.categoryService.getCategoryById(req.params.id);
      return sendSuccess(res, 'Categoría obtenida exitosamente.', category);
    } catch (error) {
      next(error);
    }
  };

  updateCategory = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const category = await this.categoryService.updateCategory(req.params.id, req.body);
      return sendSuccess(res, 'Categoría actualizada exitosamente.', category);
    } catch (error) {
      next(error);
    }
  };

  deleteCategory = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const category = await this.categoryService.deleteCategory(req.params.id);
      return sendSuccess(res, 'Categoría eliminada exitosamente.', category);
    } catch (error) {
      next(error);
    }
  };
}
