import { SaleRepository } from '../repositories/sale.repository';
import { ProductRepository } from '../repositories/product.repository';
import { ClientRepository } from '../repositories/client.repository';
import { InventoryMovementRepository } from '../repositories/inventory.repository';
import { CashRegisterService } from './cashRegister.service';
import { CreateSaleDto, ISaleDocument, ISaleItem } from '../interfaces/sale.interface';
import { BadRequestError, NotFoundError } from '../utils/customErrors';
import { env } from '../config/env';

export class SaleService {
  private saleRepository: SaleRepository;
  private productRepository: ProductRepository;
  private clientRepository: ClientRepository;
  private inventoryMovementRepository: InventoryMovementRepository;
  private cashRegisterService: CashRegisterService;

  constructor() {
    this.saleRepository = new SaleRepository();
    this.productRepository = new ProductRepository();
    this.clientRepository = new ClientRepository();
    this.inventoryMovementRepository = new InventoryMovementRepository();
    this.cashRegisterService = new CashRegisterService();
  }

  async createSale(userId: string, data: CreateSaleDto): Promise<ISaleDocument> {
    // 1. Verify user cash register is open
    const activeRegister = await this.cashRegisterService.getActiveRegister(userId);

    // 2. Verify client exists and is active
    const client = await this.clientRepository.findById(data.cliente);
    if (!client) {
      throw new NotFoundError('El cliente especificado no existe.');
    }
    if (client.estado === 'Inactivo') {
      throw new BadRequestError('El cliente especificado se encuentra inactivo.');
    }

    // 3. Process items, check stock, calculate prices
    const saleItems: ISaleItem[] = [];
    const productsToUpdate: { product: any; quantity: number; oldStock: number; newStock: number }[] = [];

    let subtotalSum = 0;
    let subtotalBaseIva = 0;
    let subtotalSinIva = 0;

    const tempDetails: any[] = [];

    for (const item of data.detalles) {
      if (item.cantidad <= 0) {
        throw new BadRequestError('La cantidad de cada detalle debe ser mayor a 0.');
      }

      if (item.tipo === 'Producto') {
        if (!item.producto) {
          throw new BadRequestError('Falta especificar el ID del producto.');
        }
        const product = await this.productRepository.findByIdWithPopulatedCategory(item.producto);
        if (!product) {
          throw new NotFoundError(`El producto con ID '${item.producto}' no existe.`);
        }
        if (product.estado === 'Inactivo') {
          throw new BadRequestError(`El producto '${product.nombre}' está inactivo.`);
        }
        if (product.stock < item.cantidad) {
          throw new BadRequestError(`Stock insuficiente para el producto '${product.nombre}'. Stock disponible: ${product.stock}, Solicitado: ${item.cantidad}`);
        }

        const itemSubtotal = product.precioVenta * item.cantidad;
        subtotalSum += itemSubtotal;

        if (product.tieneIva) {
          subtotalBaseIva += itemSubtotal;
        } else {
          subtotalSinIva += itemSubtotal;
        }

        let comPrincipal = typeof product.comisiónPrincipal === 'number' ? product.comisiónPrincipal : undefined;
        let comSecundario = typeof product.comisiónSecundario === 'number' ? product.comisiónSecundario : undefined;

        if (comPrincipal === undefined || comSecundario === undefined) {
          const category = product.categoría as any;
          if (category && typeof category === 'object') {
            if (comPrincipal === undefined) {
              comPrincipal = typeof category.comisiónPrincipal === 'number' ? category.comisiónPrincipal : 100;
            }
            if (comSecundario === undefined) {
              comSecundario = typeof category.comisiónSecundario === 'number' ? category.comisiónSecundario : 0;
            }
          } else {
            if (comPrincipal === undefined) comPrincipal = 100;
            if (comSecundario === undefined) comSecundario = 0;
          }
        }

        tempDetails.push({
          tipo: 'Producto',
          producto: product._id as any,
          cantidad: item.cantidad,
          precio: product.precioVenta,
          precioCompra: product.precioCompra,
          subtotal: itemSubtotal,
          comisiónPrincipal: comPrincipal,
          comisiónSecundario: comSecundario,
        });

        productsToUpdate.push({
          product,
          quantity: item.cantidad,
          oldStock: product.stock,
          newStock: product.stock - item.cantidad
        });

      } else {
        throw new BadRequestError(`Tipo de detalle inválido: '${item.tipo}'`);
      }
    }

    // Calculations
    const discount = data.descuento || 0;
    if (discount < 0 || discount > subtotalSum) {
      throw new BadRequestError('El descuento no puede ser negativo ni mayor al subtotal de la venta.');
    }

    const netSubtotal = subtotalSum - discount;
    const discountRatio = subtotalSum > 0 ? (subtotalSum - discount) / subtotalSum : 0;
    const netBaseIva = subtotalBaseIva * discountRatio;

    const taxValor = env.TAX_VALOR || 15;
    const ivaRate = taxValor / 100;

    const iva = parseFloat((netBaseIva * ivaRate).toFixed(2));
    const total = parseFloat((netSubtotal + iva).toFixed(2));

    // Calculate commission splits
    let totalGananciaPrincipal = 0;
    let totalGananciaSecundario = 0;

    for (const detail of tempDetails) {
      const unitProfit = Math.max(0, detail.precio - (detail.precioCompra || 0));
      const totalItemProfit = unitProfit * detail.cantidad;
      const netItemProfit = totalItemProfit * discountRatio;

      const gananciaPrincipal = parseFloat((netItemProfit * (detail.comisiónPrincipal / 100)).toFixed(2));
      const gananciaSecundario = parseFloat((netItemProfit * (detail.comisiónSecundario / 100)).toFixed(2));

      totalGananciaPrincipal += gananciaPrincipal;
      totalGananciaSecundario += gananciaSecundario;

      // remove temp field precioCompra before pushing
      const { precioCompra, ...cleanDetail } = detail;

      saleItems.push({
        ...cleanDetail,
        gananciaPrincipal,
        gananciaSecundario
      });
    }

    // Execution & Stock Deductions
    const updatedProducts: any[] = [];
    try {
      // Deduct product stock
      for (const updateObj of productsToUpdate) {
        updateObj.product.stock = updateObj.newStock;
        const savedProduct = await updateObj.product.save();
        updatedProducts.push(savedProduct);
      }
    } catch (error) {
      // Rollback stock updates if any save fail
      for (const rollbackObj of productsToUpdate) {
        const prod = await this.productRepository.findById(rollbackObj.product._id);
        if (prod) {
          prod.stock = rollbackObj.oldStock;
          await prod.save();
        }
      }
      throw error;
    }

    // Save Sale Document
    let sale: ISaleDocument;
    try {
      sale = await this.saleRepository.create({
        cliente: client._id as any,
        usuario: userId,
        caja: activeRegister._id as any,
        fecha: new Date(),
        estado: 'Completada',
        subtotal: parseFloat(subtotalSum.toFixed(2)),
        iva,
        descuento: discount,
        total,
        métodoPago: data.métodoPago,
        observaciones: data.observaciones || '',
        comprobanteUrl: data.comprobanteUrl || '',
        referenciaTransferencia: data.referenciaTransferencia || '',
        gananciaPrincipal: parseFloat(totalGananciaPrincipal.toFixed(2)),
        gananciaSecundario: parseFloat(totalGananciaSecundario.toFixed(2)),
        detalles: saleItems,
      });
    } catch (error) {
      // Rollback stock updates if sale creation fails
      for (const rollbackObj of productsToUpdate) {
        const prod = await this.productRepository.findById(rollbackObj.product._id);
        if (prod) {
          prod.stock = rollbackObj.oldStock;
          await prod.save();
        }
      }
      throw error;
    }

    // Create Inventory Movements
    for (const updateObj of productsToUpdate) {
      await this.inventoryMovementRepository.create({
        usuario: userId,
        producto: updateObj.product._id,
        cantidad: updateObj.quantity,
        stockAnterior: updateObj.oldStock,
        stockNuevo: updateObj.newStock,
        motivo: `Venta #${sale._id}`,
        tipo: 'Salida',
        fecha: new Date(),
      });
    }

    // Record cash register income movement ONLY if paid in Efectivo
    if (data.métodoPago === 'Efectivo') {
      await this.cashRegisterService.recordSaleMovement(
        userId,
        total,
        `Venta #${sale._id} (Efectivo)`
      );
    }

    return (await this.saleRepository.findByIdWithDetails((sale._id as any).toString()))!;
  }

  async getSaleById(id: string): Promise<ISaleDocument> {
    const sale = await this.saleRepository.findByIdWithDetails(id);
    if (!sale) {
      throw new NotFoundError('Venta no encontrada.');
    }
    return sale;
  }

  async getAllSales(): Promise<ISaleDocument[]> {
    return this.saleRepository.findWithDetails({});
  }

  async annulSale(userId: string, id: string): Promise<ISaleDocument> {
    const sale = await this.getSaleById(id);

    if (sale.estado === 'Anulada') {
      throw new BadRequestError('Esta venta ya se encuentra anulada.');
    }

    // Verify cash register is open for user who annuls
    await this.cashRegisterService.getActiveRegister(userId);

    // Annul the sale
    sale.estado = 'Anulada';
    const updatedSale = await sale.save();

    // Restore stocks and log inventory movements
    for (const item of sale.detalles) {
      if (item.tipo === 'Producto' && item.producto) {
        const product = await this.productRepository.findById((item.producto as any)._id || item.producto);
        if (product) {
          const oldStock = product.stock;
          const newStock = oldStock + item.cantidad;
          product.stock = newStock;
          await product.save();

          // Log inventory movement for adjustment
          await this.inventoryMovementRepository.create({
            usuario: userId,
            producto: product._id,
            cantidad: item.cantidad,
            stockAnterior: oldStock,
            stockNuevo: newStock,
            motivo: `Devolución por anulación de Venta #${sale._id}`,
            tipo: 'Ingreso',
            fecha: new Date(),
          });
        }
      }
    }

    // Record negative movement in Cash Register ONLY if original sale was paid in Efectivo
    if (sale.métodoPago === 'Efectivo') {
      await this.cashRegisterService.recordSaleAnnulmentMovement(
        userId,
        sale.total,
        `Anulación de Venta #${sale._id} (Efectivo)`
      );
    }

    return (await this.saleRepository.findByIdWithDetails(id))!;
  }
}
