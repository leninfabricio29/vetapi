import { BaseRepository } from './base.repository';
import { ISaleDocument } from '../interfaces/sale.interface';
import { SaleModel } from '../models/sale.model';

export class SaleRepository extends BaseRepository<ISaleDocument> {
  constructor() {
    super(SaleModel);
  }

  async findWithDetails(filter: any = {}): Promise<ISaleDocument[]> {
    return this.model
      .find(this.getQueryFilter(filter))
      .populate('cliente')
      .populate('usuario', 'nombres apellidos usuario rol tipoComisión')
      .populate('detalles.producto')
      .populate('detalles.servicio')
      .sort({ fecha: -1 })
      .exec();
  }

  async findByIdWithDetails(id: string): Promise<ISaleDocument | null> {
    return this.model
      .findOne(this.getQueryFilter({ _id: id }))
      .populate('cliente')
      .populate('usuario', 'nombres apellidos usuario rol tipoComisión')
      .populate('detalles.producto')
      .populate('detalles.servicio')
      .exec();
  }
}
