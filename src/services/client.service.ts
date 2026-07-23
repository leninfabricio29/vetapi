import { ClientRepository } from '../repositories/client.repository';
import { CreateClientDto, UpdateClientDto, IClientDocument } from '../interfaces/client.interface';
import { ConflictError, NotFoundError } from '../utils/customErrors';

export class ClientService {
  private clientRepository: ClientRepository;

  constructor() {
    this.clientRepository = new ClientRepository();
  }

  async createClient(data: CreateClientDto): Promise<IClientDocument> {
    const existingCédula = await this.clientRepository.findByCédula(data.cédula);
    if (existingCédula) {
      throw new ConflictError('Ya existe un cliente registrado con esta cédula.');
    }

    const existingEmail = await this.clientRepository.findByEmail(data.email);
    if (existingEmail) {
      throw new ConflictError('Ya existe un cliente registrado con este correo electrónico.');
    }

    return this.clientRepository.create(data);
  }

  async getAllClients(searchQuery?: string): Promise<IClientDocument[]> {
    if (searchQuery) {
      return this.clientRepository.search(searchQuery);
    }
    return this.clientRepository.find({});
  }

  async getClientById(id: string): Promise<IClientDocument> {
    const client = await this.clientRepository.findById(id);
    if (!client) {
      throw new NotFoundError('Cliente no encontrado.');
    }
    return client;
  }

  async updateClient(id: string, data: UpdateClientDto): Promise<IClientDocument> {
    const client = await this.getClientById(id);

    if (data.cédula && data.cédula !== client.cédula) {
      const existingCédula = await this.clientRepository.findByCédula(data.cédula);
      if (existingCédula) {
        throw new ConflictError('Ya existe un cliente registrado con esta cédula.');
      }
    }

    if (data.email && data.email.toLowerCase() !== client.email.toLowerCase()) {
      const existingEmail = await this.clientRepository.findByEmail(data.email);
      if (existingEmail) {
        throw new ConflictError('Ya existe un cliente registrado con este correo electrónico.');
      }
    }

    const updatedClient = await this.clientRepository.update(id, data);
    if (!updatedClient) {
      throw new NotFoundError('Cliente no encontrado para actualizar.');
    }
    return updatedClient;
  }

  async deleteClient(id: string): Promise<IClientDocument> {
    await this.getClientById(id);
    const deleted = await this.clientRepository.delete(id);
    if (!deleted) {
      throw new NotFoundError('Cliente no encontrado para eliminar.');
    }
    return deleted;
  }
}
