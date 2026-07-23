import { CashRegisterRepository } from '../repositories/cashRegister.repository';
import { CashMovementRepository } from '../repositories/cashMovement.repository';
import { ICashRegisterDocument, OpenCashRegisterDto, CloseCashRegisterDto } from '../interfaces/cashRegister.interface';
import { ICashMovementDocument } from '../interfaces/cashMovement.interface';
import { BadRequestError, NotFoundError } from '../utils/customErrors';

export class CashRegisterService {
  private cashRegisterRepository: CashRegisterRepository;
  private cashMovementRepository: CashMovementRepository;

  constructor() {
    this.cashRegisterRepository = new CashRegisterRepository();
    this.cashMovementRepository = new CashMovementRepository();
  }

  async openRegister(userId: string, data: OpenCashRegisterDto): Promise<ICashRegisterDocument> {
    const active = await this.cashRegisterRepository.findActiveRegister(userId);
    if (active) {
      throw new BadRequestError('Ya existe una caja abierta para este usuario. Debe cerrarla primero.');
    }

    return this.cashRegisterRepository.create({
      montoInicial: data.montoInicial,
      usuario: userId,
      fechaApertura: new Date(),
      estado: 'Abierta',
      ventas: 0,
      ingresos: 0,
      egresos: 0,
      efectivoEsperado: data.montoInicial,
    });
  }

  async getActiveRegister(userId: string): Promise<ICashRegisterDocument> {
    const active = await this.cashRegisterRepository.findActiveRegister(userId);
    if (!active) {
      throw new BadRequestError('No se encontró una caja abierta para este usuario.');
    }
    return active;
  }

  async closeRegister(userId: string, data: CloseCashRegisterDto): Promise<ICashRegisterDocument> {
    const active = await this.getActiveRegister(userId);

    // Calculate actual totals based on cash movements
    const movements = await this.cashMovementRepository.find({ caja: active._id });
    
    let salesSum = 0;
    let incomesSum = 0;
    let expensesSum = 0;

    for (const mov of movements) {
      if (mov.tipo === 'Ingreso') {
        if (mov.concepto.startsWith('Venta')) {
          salesSum += mov.monto;
        } else {
          incomesSum += mov.monto;
        }
      } else if (mov.tipo === 'Egreso') {
        expensesSum += mov.monto;
      }
    }

    const expected = active.montoInicial + salesSum + incomesSum - expensesSum;
    const difference = data.efectivoContado - expected;

    const closedRegister = await this.cashRegisterRepository.update((active._id as any).toString(), {
      ventas: salesSum,
      ingresos: incomesSum,
      egresos: expensesSum,
      efectivoEsperado: expected,
      efectivoContado: data.efectivoContado,
      montoFinal: data.efectivoContado,
      diferencia: difference,
      estado: 'Cerrada',
      fechaCierre: new Date()
    });

    if (!closedRegister) {
      throw new NotFoundError('Error al cerrar la caja.');
    }

    return closedRegister;
  }

  async addManualMovement(
    userId: string,
    tipo: 'Ingreso' | 'Egreso',
    concepto: string,
    monto: number,
    descripción?: string
  ): Promise<ICashMovementDocument> {
    const active = await this.getActiveRegister(userId);

    const movement = await this.cashMovementRepository.create({
      tipo,
      concepto,
      descripción,
      monto,
      usuario: userId,
      caja: active._id,
    });

    // Update current cached expected cash values on active cash register
    if (tipo === 'Ingreso') {
      active.ingresos += monto;
    } else {
      active.egresos += monto;
    }
    active.efectivoEsperado = active.montoInicial + active.ventas + active.ingresos - active.egresos;
    await active.save();

    return movement;
  }

  async recordSaleMovement(userId: string, amount: number, concept: string): Promise<ICashMovementDocument> {
    const active = await this.getActiveRegister(userId);

    const movement = await this.cashMovementRepository.create({
      tipo: 'Ingreso',
      concepto: concept,
      monto: amount,
      usuario: userId,
      caja: active._id,
    });

    active.ventas += amount;
    active.efectivoEsperado = active.montoInicial + active.ventas + active.ingresos - active.egresos;
    await active.save();

    return movement;
  }

  async recordSaleAnnulmentMovement(userId: string, amount: number, concept: string): Promise<ICashMovementDocument> {
    const active = await this.getActiveRegister(userId);

    const movement = await this.cashMovementRepository.create({
      tipo: 'Egreso',
      concepto: concept,
      monto: amount,
      usuario: userId,
      caja: active._id,
    });

    active.egresos += amount;
    active.efectivoEsperado = active.montoInicial + active.ventas + active.ingresos - active.egresos;
    await active.save();

    return movement;
  }

  async getMovementsByRegister(cashRegisterId: string): Promise<ICashMovementDocument[]> {
    return this.cashMovementRepository.findByRegister(cashRegisterId);
  }

  async getAllRegisters(): Promise<ICashRegisterDocument[]> {
    return this.cashRegisterRepository.findWithDetails({});
  }
}
