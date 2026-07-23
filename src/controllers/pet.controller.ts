import { Request, Response, NextFunction } from 'express';
import { PetService } from '../services/pet.service';
import { sendSuccess } from '../utils/responseHelper';

export class PetController {
  private petService: PetService;

  constructor() {
    this.petService = new PetService();
  }

  createPet = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const pet = await this.petService.createPet(req.body);
      return sendSuccess(res, 'Mascota registrada exitosamente.', pet, 201);
    } catch (error) {
      next(error);
    }
  };

  getAllPets = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const pets = await this.petService.getAllPets();
      return sendSuccess(res, 'Mascotas obtenidas exitosamente.', pets);
    } catch (error) {
      next(error);
    }
  };

  getPetById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const pet = await this.petService.getPetById(req.params.id);
      return sendSuccess(res, 'Mascota obtenida exitosamente.', pet);
    } catch (error) {
      next(error);
    }
  };

  getPetsByOwner = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const pets = await this.petService.getPetsByOwner(req.params.clientId);
      return sendSuccess(res, 'Mascotas del propietario obtenidas exitosamente.', pets);
    } catch (error) {
      next(error);
    }
  };

  updatePet = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const pet = await this.petService.updatePet(req.params.id, req.body);
      return sendSuccess(res, 'Mascota actualizada exitosamente.', pet);
    } catch (error) {
      next(error);
    }
  };

  deletePet = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const pet = await this.petService.deletePet(req.params.id);
      return sendSuccess(res, 'Mascota eliminada exitosamente.', pet);
    } catch (error) {
      next(error);
    }
  };
}
