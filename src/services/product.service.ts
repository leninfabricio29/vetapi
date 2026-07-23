import { ProductRepository } from '../repositories/product.repository';
import { CategoryRepository } from '../repositories/category.repository';
import { InventoryMovementRepository } from '../repositories/inventory.repository';
import { CreateProductDto, UpdateProductDto, IProductDocument } from '../interfaces/product.interface';
import { ConflictError, NotFoundError } from '../utils/customErrors';

export class ProductService {
  private productRepository: ProductRepository;
  private categoryRepository: CategoryRepository;
  private inventoryMovementRepository: InventoryMovementRepository;

  constructor() {
    this.productRepository = new ProductRepository();
    this.categoryRepository = new CategoryRepository();
    this.inventoryMovementRepository = new InventoryMovementRepository();
  }

  async createProduct(userId: string, data: CreateProductDto): Promise<IProductDocument> {
    // Validate category
    const category = await this.categoryRepository.findById(data.categoría);
    if (!category) {
      throw new NotFoundError('La categoría especificada no existe.');
    }

    // Validate unique code
    const existingCode = await this.productRepository.findByCode(data.código);
    if (existingCode) {
      throw new ConflictError('Ya existe un producto registrado con este código.');
    }

    const product = await this.productRepository.create(data);

    // Register initial inventory movement if stock > 0
    if (product.stock > 0) {
      await this.inventoryMovementRepository.create({
        usuario: userId,
        producto: product._id,
        cantidad: product.stock,
        stockAnterior: 0,
        stockNuevo: product.stock,
        motivo: 'Stock inicial registrado',
        tipo: 'Ingreso',
        fecha: new Date(),
      });
    }

    return product;
  }

  async getAllProducts(): Promise<IProductDocument[]> {
    return this.productRepository.findWithPopulatedCategory({});
  }

  async getProductById(id: string): Promise<IProductDocument> {
    const product = await this.productRepository.findByIdWithPopulatedCategory(id);
    if (!product) {
      throw new NotFoundError('Producto no encontrado.');
    }
    return product;
  }

  async updateProduct(userId: string, id: string, data: UpdateProductDto): Promise<IProductDocument> {
    const product = await this.productRepository.findById(id);
    if (!product) {
      throw new NotFoundError('Producto no encontrado.');
    }

    if (data.categoría) {
      const category = await this.categoryRepository.findById(data.categoría);
      if (!category) {
        throw new NotFoundError('La categoría especificada no existe.');
      }
    }

    if (data.código && data.código !== product.código) {
      const existingCode = await this.productRepository.findByCode(data.código);
      if (existingCode) {
        throw new ConflictError('Ya existe un producto registrado con este código.');
      }
    }

    const oldStock = product.stock;
    const newStock = data.stock;

    const updated = await this.productRepository.update(id, data);
    if (!updated) {
      throw new NotFoundError('Producto no encontrado para actualizar.');
    }

    // Log inventory adjustment if stock changed
    if (newStock !== undefined && newStock !== oldStock) {
      const diff = newStock - oldStock;
      await this.inventoryMovementRepository.create({
        usuario: userId,
        producto: updated._id,
        cantidad: Math.abs(diff),
        stockAnterior: oldStock,
        stockNuevo: newStock,
        motivo: `Ajuste manual de inventario (${diff > 0 ? 'incremento' : 'decremento'})`,
        tipo: 'Ajuste',
        fecha: new Date(),
      });
    }

    return updated;
  }

  async deleteProduct(id: string): Promise<IProductDocument> {
    await this.getProductById(id);
    const deleted = await this.productRepository.delete(id);
    if (!deleted) {
      throw new NotFoundError('Producto no encontrado para eliminar.');
    }
    return deleted;
  }

  async getLowStockProducts(): Promise<IProductDocument[]> {
    return this.productRepository.findLowStock();
  }
}
