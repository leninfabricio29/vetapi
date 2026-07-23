import { ServiceRepository } from '../repositories/service.repository';
import { CreateServiceDto, UpdateServiceDto, IServiceDocument } from '../interfaces/service.interface';
import { ConflictError, NotFoundError } from '../utils/customErrors';

export class ServiceService {
  private serviceRepository: ServiceRepository;

  constructor() {
    this.serviceRepository = new ServiceRepository();
  }

  async createService(data: CreateServiceDto): Promise<IServiceDocument> {
    const existing = await this.serviceRepository.findByName(data.nombre);
    if (existing) {
      throw new ConflictError('Ya existe un servicio registrado con este nombre.');
    }
    return this.serviceRepository.create(data);
  }

  async getAllServices(): Promise<IServiceDocument[]> {
    return this.serviceRepository.find({});
  }

  async getServiceById(id: string): Promise<IServiceDocument> {
    const service = await this.serviceRepository.findById(id);
    if (!service) {
      throw new NotFoundError('Servicio no encontrado.');
    }
    return service;
  }

  async updateService(id: string, data: UpdateServiceDto): Promise<IServiceDocument> {
    const service = await this.getServiceById(id);

    if (data.nombre && data.nombre.toLowerCase() !== service.nombre.toLowerCase()) {
      const existing = await this.serviceRepository.findByName(data.nombre);
      if (existing) {
        throw new ConflictError('Ya existe un servicio registrado con este nombre.');
      }
    }

    const updated = await this.serviceRepository.update(id, data);
    if (!updated) {
      throw new NotFoundError('Servicio no encontrado para actualizar.');
    }
    return updated;
  }

  async deleteService(id: string): Promise<IServiceDocument> {
    await this.getServiceById(id);
    const deleted = await this.serviceRepository.delete(id);
    if (!deleted) {
      throw new NotFoundError('Servicio no encontrado para eliminar.');
    }
    return deleted;
  }
}
