import { CategoryRepository } from '../repositories/category.repository';
import { CreateCategoryDto, UpdateCategoryDto, ICategoryDocument } from '../interfaces/category.interface';
import { ConflictError, NotFoundError } from '../utils/customErrors';

export class CategoryService {
  private categoryRepository: CategoryRepository;

  constructor() {
    this.categoryRepository = new CategoryRepository();
  }

  async createCategory(data: CreateCategoryDto): Promise<ICategoryDocument> {
    const existing = await this.categoryRepository.findByName(data.nombre);
    if (existing) {
      throw new ConflictError('Ya existe una categoría registrada con este nombre.');
    }
    return this.categoryRepository.create(data);
  }

  async getAllCategories(): Promise<ICategoryDocument[]> {
    return this.categoryRepository.find({});
  }

  async getCategoryById(id: string): Promise<ICategoryDocument> {
    const category = await this.categoryRepository.findById(id);
    if (!category) {
      throw new NotFoundError('Categoría no encontrada.');
    }
    return category;
  }

  async updateCategory(id: string, data: UpdateCategoryDto): Promise<ICategoryDocument> {
    const category = await this.getCategoryById(id);

    if (data.nombre && data.nombre.toLowerCase() !== category.nombre.toLowerCase()) {
      const existing = await this.categoryRepository.findByName(data.nombre);
      if (existing) {
        throw new ConflictError('Ya existe una categoría registrada con este nombre.');
      }
    }

    const updated = await this.categoryRepository.update(id, data);
    if (!updated) {
      throw new NotFoundError('Categoría no encontrada para actualizar.');
    }
    return updated;
  }

  async deleteCategory(id: string): Promise<ICategoryDocument> {
    await this.getCategoryById(id);
    const deleted = await this.categoryRepository.delete(id);
    if (!deleted) {
      throw new NotFoundError('Categoría no encontrada para eliminar.');
    }
    return deleted;
  }
}
