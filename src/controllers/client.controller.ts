import { Request, Response, NextFunction } from 'express';
import { ClientService } from '../services/client.service';
import { sendSuccess } from '../utils/responseHelper';

export class ClientController {
  private clientService: ClientService;

  constructor() {
    this.clientService = new ClientService();
  }

  createClient = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const client = await this.clientService.createClient(req.body);
      return sendSuccess(res, 'Cliente registrado exitosamente.', client, 201);
    } catch (error) {
      next(error);
    }
  };

  getAllClients = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const search = req.query.search as string | undefined;
      const clients = await this.clientService.getAllClients(search);
      return sendSuccess(res, 'Clientes obtenidos exitosamente.', clients);
    } catch (error) {
      next(error);
    }
  };

  getClientById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const client = await this.clientService.getClientById(req.params.id);
      return sendSuccess(res, 'Cliente obtenido exitosamente.', client);
    } catch (error) {
      next(error);
    }
  };

  updateClient = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const client = await this.clientService.updateClient(req.params.id, req.body);
      return sendSuccess(res, 'Cliente actualizado exitosamente.', client);
    } catch (error) {
      next(error);
    }
  };

  deleteClient = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const client = await this.clientService.deleteClient(req.params.id);
      return sendSuccess(res, 'Cliente eliminado exitosamente.', client);
    } catch (error) {
      next(error);
    }
  };
}
