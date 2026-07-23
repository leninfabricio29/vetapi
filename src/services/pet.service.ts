import { PetRepository } from '../repositories/pet.repository';
import { ClientRepository } from '../repositories/client.repository';
import { CreatePetDto, UpdatePetDto, IPetDocument } from '../interfaces/pet.interface';
import { NotFoundError } from '../utils/customErrors';

export class PetService {
  private petRepository: PetRepository;
  private clientRepository: ClientRepository;

  constructor() {
    this.petRepository = new PetRepository();
    this.clientRepository = new ClientRepository();
  }

  async createPet(data: CreatePetDto): Promise<IPetDocument> {
    const client = await this.clientRepository.findById(data.propietario);
    if (!client) {
      throw new NotFoundError('El propietario especificado no existe.');
    }

    return this.petRepository.create(data);
  }

  async getAllPets(): Promise<IPetDocument[]> {
    return this.petRepository.findWithPopulatedOwner({});
  }

  async getPetById(id: string): Promise<IPetDocument> {
    const pet = await this.petRepository.findByIdWithPopulatedOwner(id);
    if (!pet) {
      throw new NotFoundError('Mascota no encontrada.');
    }
    return pet;
  }

  async getPetsByOwner(clientId: string): Promise<IPetDocument[]> {
    const client = await this.clientRepository.findById(clientId);
    if (!client) {
      throw new NotFoundError('El propietario especificado no existe.');
    }
    return this.petRepository.findByOwner(clientId);
  }

  async updatePet(id: string, data: UpdatePetDto): Promise<IPetDocument> {
    await this.getPetById(id);

    if (data.propietario) {
      const client = await this.clientRepository.findById(data.propietario);
      if (!client) {
        throw new NotFoundError('El propietario especificado no existe.');
      }
    }

    const updated = await this.petRepository.update(id, data);
    if (!updated) {
      throw new NotFoundError('Mascota no encontrada para actualizar.');
    }
    return updated;
  }

  async deletePet(id: string): Promise<IPetDocument> {
    await this.getPetById(id);
    const deleted = await this.petRepository.delete(id);
    if (!deleted) {
      throw new NotFoundError('Mascota no encontrada para eliminar.');
    }
    return deleted;
  }
}
