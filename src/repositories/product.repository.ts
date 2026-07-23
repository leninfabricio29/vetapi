import { BaseRepository } from './base.repository';
import { IProductDocument } from '../interfaces/product.interface';
import { ProductModel } from '../models/product.model';

export class ProductRepository extends BaseRepository<IProductDocument> {
  constructor() {
    super(ProductModel);
  }

  async findByCode(code: string): Promise<IProductDocument | null> {
    return this.model.findOne(this.getQueryFilter({ código: code.trim() })).populate('categoría').exec();
  }

  async findWithPopulatedCategory(filter: any = {}): Promise<IProductDocument[]> {
    return this.model.find(this.getQueryFilter(filter)).populate('categoría').exec();
  }

  async findByIdWithPopulatedCategory(id: string): Promise<IProductDocument | null> {
    return this.model.findOne(this.getQueryFilter({ _id: id })).populate('categoría').exec();
  }

  async findLowStock(): Promise<IProductDocument[]> {
    return this.model.find(this.getQueryFilter({
      $expr: { $lte: ['$stock', '$stockMínimo'] },
      estado: 'Activo'
    })).populate('categoría').exec();
  }
}
