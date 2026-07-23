import { BaseRepository } from './base.repository';
import { ICategoryDocument } from '../interfaces/category.interface';
import { CategoryModel } from '../models/category.model';

export class CategoryRepository extends BaseRepository<ICategoryDocument> {
  constructor() {
    super(CategoryModel);
  }

  async findByName(name: string): Promise<ICategoryDocument | null> {
    return this.model.findOne({ nombre: { $regex: new RegExp(`^${name}$`, 'i') } }).exec();
  }
}
