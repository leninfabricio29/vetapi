import { Model, Document, FilterQuery, UpdateQuery, QueryOptions } from 'mongoose';
import { tenantStore } from '../config/tenantContext';

export class BaseRepository<T extends Document> {
  protected model: Model<T>;

  constructor(model: Model<T>) {
    this.model = model;
  }

  protected getQueryFilter(filter: any = {}): any {
    const context = tenantStore.getStore();
    const queryFilter = { ...filter };
    if (context?.veterinariaId) {
      queryFilter.veterinaria = context.veterinariaId;
    }
    return queryFilter;
  }

  async create(data: any): Promise<T> {
    const context = tenantStore.getStore();
    if (context?.veterinariaId) {
      data.veterinaria = context.veterinariaId;
    }
    return this.model.create(data);
  }

  async find(filter: FilterQuery<T> = {}, options: QueryOptions = {}): Promise<T[]> {
    return this.model.find(this.getQueryFilter(filter), null, options).exec();
  }

  async findOne(filter: FilterQuery<T>): Promise<T | null> {
    return this.model.findOne(this.getQueryFilter(filter)).exec();
  }

  async findById(id: string): Promise<T | null> {
    return this.model.findOne(this.getQueryFilter({ _id: id })).exec();
  }

  async update(id: string, data: UpdateQuery<T>): Promise<T | null> {
    return this.model.findOneAndUpdate(this.getQueryFilter({ _id: id }), data, { new: true, runValidators: true }).exec();
  }

  async delete(id: string): Promise<T | null> {
    return this.model.findOneAndDelete(this.getQueryFilter({ _id: id })).exec();
  }

  async count(filter: FilterQuery<T> = {}): Promise<number> {
    return this.model.countDocuments(this.getQueryFilter(filter)).exec();
  }
}
