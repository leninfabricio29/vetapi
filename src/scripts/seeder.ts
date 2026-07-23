import mongoose from 'mongoose';
import { connectDB } from '../database/connection';
import { VeterinaryModel } from '../models/veterinary.model';
import { UserModel } from '../models/user.model';
import { ClientModel } from '../models/client.model';
import { CategoryModel } from '../models/category.model';
import { ProductModel } from '../models/product.model';
import { InventoryMovementModel } from '../models/inventory.model';
import { CashRegisterModel } from '../models/cashRegister.model';
import { CashMovementModel } from '../models/cashMovement.model';
import { SaleModel } from '../models/sale.model';
import { UserRole } from '../constants/roles';

const seedDatabase = async () => {
  try {
    await connectDB();
    console.log('Limpiando base de datos...');

    // Clean up collections
    await VeterinaryModel.deleteMany({});
    await UserModel.deleteMany({});
    await ClientModel.deleteMany({});
    await CategoryModel.deleteMany({});
    await ProductModel.deleteMany({});
    await InventoryMovementModel.deleteMany({});
    await CashRegisterModel.deleteMany({});
    await CashMovementModel.deleteMany({});
    await SaleModel.deleteMany({});

    console.log('Creando veterinaria de prueba (tenant)...');

    const defaultVet = await VeterinaryModel.create({
      nombre: 'Veterinaria Principal',
      RUC: '1792847596001',
      dirección: 'Av. Amazonas N24-123 y Colón, Quito',
      teléfono: '022555666',
      email: 'contacto@vetprincipal.com',
      plan: 'Premium'
    });

    console.log('Insertando usuarios iniciales...');

    // 1. Create Users
    const admin = new UserModel({
      nombres: 'Administrador',
      apellidos: 'Principal',
      email: 'admin@veterinaria.com',
      teléfono: '0991111111',
      usuario: 'admin',
      contraseña: 'Admin123!',
      rol: UserRole.ADMIN,
      estado: 'Activo',
      tipoComisión: 'Principal',
      veterinaria: defaultVet._id,
    });

    const veterinarian = new UserModel({
      nombres: 'Carlos',
      apellidos: 'Mendoza',
      email: 'carlos@veterinaria.com',
      teléfono: '0992222222',
      usuario: 'carlos.vet',
      contraseña: 'Carlos123!',
      rol: UserRole.VETERINARIAN,
      estado: 'Activo',
      tipoComisión: 'Secundario',
      veterinaria: defaultVet._id,
    });

    const cashier = new UserModel({
      nombres: 'Ana',
      apellidos: 'Gómez',
      email: 'ana@veterinaria.com',
      teléfono: '0993333333',
      usuario: 'ana.caja',
      contraseña: 'Ana123!',
      rol: UserRole.CASHIER,
      estado: 'Activo',
      tipoComisión: 'Secundario',
      veterinaria: defaultVet._id,
    });

    const receptionist = new UserModel({
      nombres: 'Sofía',
      apellidos: 'Ruiz',
      email: 'sofia@veterinaria.com',
      teléfono: '0994444444',
      usuario: 'sofia.rec',
      contraseña: 'Sofia123!',
      rol: UserRole.RECEPTIONIST,
      estado: 'Activo',
      tipoComisión: 'Secundario',
      veterinaria: defaultVet._id,
    });

    await Promise.all([
      admin.save(),
      veterinarian.save(),
      cashier.save(),
      receptionist.save(),
    ]);

    console.log('Insertando clientes iniciales...');

    // 2. Create Clients
    const client1 = await ClientModel.create({
      nombres: 'Juan',
      apellidos: 'Pérez',
      cédula: '1725556667',
      teléfono: '0987654321',
      email: 'juan.perez@email.com',
      dirección: 'La Floresta, Calle Lérida 340',
      estado: 'Activo',
      veterinaria: defaultVet._id,
    });

    const client2 = await ClientModel.create({
      nombres: 'María',
      apellidos: 'López',
      cédula: '1726667778',
      teléfono: '0987654322',
      email: 'maria.lopez@email.com',
      dirección: 'Cumbayá, Av. Interoceánica 12',
      estado: 'Activo',
      veterinaria: defaultVet._id,
    });

    console.log('Insertando categorías...');

    // 3. Create Categories
    const catMedicinas = await CategoryModel.create({
      nombre: 'Medicinas',
      descripción: 'Fármacos, vacunas y tratamientos médicos',
      comisiónPrincipal: 80,
      comisiónSecundario: 20,
      veterinaria: defaultVet._id,
    });

    const catAlimentos = await CategoryModel.create({
      nombre: 'Alimentos',
      descripción: 'Comida húmeda, seca y snacks terapéuticos',
      comisiónPrincipal: 90,
      comisiónSecundario: 10,
      veterinaria: defaultVet._id,
    });

    const catAccesorios = await CategoryModel.create({
      nombre: 'Accesorios',
      descripción: 'Collares, correas, juguetes y camas',
      comisiónPrincipal: 70,
      comisiónSecundario: 30,
      veterinaria: defaultVet._id,
    });

    console.log('Insertando productos e inventario...');

    // 4. Create Products
    const prodNexgard = await ProductModel.create({
      código: 'P001',
      nombre: 'Nexgard 10-25 kg',
      descripción: 'Antiparasitario masticable para perros medianos',
      categoría: catMedicinas._id,
      precioCompra: 18.50,
      precioVenta: 25.00,
      stock: 50,
      stockMínimo: 10,
      unidad: 'Caja',
      proveedor: 'Boehringer Ingelheim',
      tieneIva: false,
      veterinaria: defaultVet._id,
    });

    const prodRoyalCanin = await ProductModel.create({
      código: 'P002',
      nombre: 'Royal Canin Urinary S/O Canino 2kg',
      descripción: 'Alimento medicado para disolver cálculos de estruvita',
      categoría: catAlimentos._id,
      precioCompra: 45.00,
      precioVenta: 65.00,
      stock: 30,
      stockMínimo: 5,
      unidad: 'Bolsa',
      proveedor: 'Provet',
      tieneIva: false,
      veterinaria: defaultVet._id,
    });

    const prodCollar = await ProductModel.create({
      código: 'P003',
      nombre: 'Collar Isabelino N.4',
      descripción: 'Collar protector plástico post-cirugía',
      categoría: catAccesorios._id,
      precioCompra: 3.50,
      precioVenta: 8.00,
      stock: 15,
      stockMínimo: 3,
      unidad: 'Unidad',
      proveedor: 'Distribuidora Vet',
      tieneIva: true,
      veterinaria: defaultVet._id,
    });

    // 5. Create Inventory Movements
    await InventoryMovementModel.create([
      {
        fecha: new Date(Date.now() - 1000 * 60 * 60 * 24), // 24 hours ago
        usuario: admin._id,
        producto: prodNexgard._id,
        cantidad: 50,
        stockAnterior: 0,
        stockNuevo: 50,
        motivo: 'Carga inicial de inventario',
        tipo: 'Ingreso',
        veterinaria: defaultVet._id,
      },
      {
        fecha: new Date(Date.now() - 1000 * 60 * 60 * 12), // 12 hours ago
        usuario: admin._id,
        producto: prodRoyalCanin._id,
        cantidad: 30,
        stockAnterior: 0,
        stockNuevo: 30,
        motivo: 'Carga inicial de inventario',
        tipo: 'Ingreso',
        veterinaria: defaultVet._id,
      },
      {
        fecha: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
        usuario: admin._id,
        producto: prodCollar._id,
        cantidad: 15,
        stockAnterior: 0,
        stockNuevo: 15,
        motivo: 'Carga inicial de inventario',
        tipo: 'Ingreso',
        veterinaria: defaultVet._id,
      },
    ]);

    console.log('Insertando cajas...');

    // 6. Create daily cash registers
    // One closed box (yesterday)
    const closedRegister = await CashRegisterModel.create({
      montoInicial: 100.0,
      montoFinal: 190.0,
      fechaApertura: new Date(Date.now() - 1000 * 60 * 60 * 28), // 28 hours ago
      fechaCierre: new Date(Date.now() - 1000 * 60 * 60 * 20), // 20 hours ago
      usuario: cashier._id,
      ventas: 90.0,
      ingresos: 0,
      egresos: 0,
      efectivoEsperado: 190.0,
      efectivoContado: 190.0,
      diferencia: 0,
      estado: 'Cerrada',
      veterinaria: defaultVet._id,
    });

    // Active/Open box (today)
    const openRegister = await CashRegisterModel.create({
      montoInicial: 150.0,
      fechaApertura: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
      usuario: cashier._id,
      ventas: 97.75,
      ingresos: 0,
      egresos: 0,
      efectivoEsperado: 247.75,
      estado: 'Abierta',
      veterinaria: defaultVet._id,
    });

    console.log('Insertando venta de prueba...');

    // 7. Create a Sale
    // Subtotal: P001 (25.0) + P002 (65.0) = 90.0
    // Discount: 5.0
    // Net: 85.0
    // IVA: 85 * 15% = 12.75
    // Total: 97.75
    const sale1 = await SaleModel.create({
      cliente: client1._id,
      usuario: cashier._id,
      caja: openRegister._id,
      fecha: new Date(Date.now() - 1000 * 60 * 30), // 30 mins ago
      estado: 'Completada',
      subtotal: 90.0,
      iva: 12.75,
      descuento: 5.0,
      total: 97.75,
      métodoPago: 'Efectivo',
      observaciones: 'Descuento autorizado por administrador',
      gananciaPrincipal: 6.25,
      gananciaSecundario: 18.77,
      veterinaria: defaultVet._id,
      detalles: [
        {
          tipo: 'Producto',
          producto: prodNexgard._id,
          cantidad: 1,
          precio: 25.0,
          subtotal: 25.0,
          comisiónPrincipal: 80,
          comisiónSecundario: 20,
          gananciaPrincipal: 4.91, // Utility profit: (25 - 18.5) * (85/90) = 6.14. principal commission = 6.14 * 0.8 = 4.91
          gananciaSecundario: 1.23, // 6.14 * 0.2 = 1.23
        },
        {
          tipo: 'Producto',
          producto: prodRoyalCanin._id,
          cantidad: 1,
          precio: 65.0,
          subtotal: 65.0,
          comisiónPrincipal: 90,
          comisiónSecundario: 10,
          gananciaPrincipal: 17.00, // Utility profit: (65 - 45) * (85/90) = 18.89. principal commission = 18.89 * 0.9 = 17.00
          gananciaSecundario: 1.89, // 18.89 * 0.1 = 1.89
        },
      ],
    });

    // Register sale inventory movement outputs
    await InventoryMovementModel.create([
      {
        fecha: sale1.fecha,
        usuario: cashier._id,
        producto: prodNexgard._id,
        cantidad: 1,
        stockAnterior: 50,
        stockNuevo: 49,
        motivo: `Venta #${sale1._id}`,
        tipo: 'Salida',
        veterinaria: defaultVet._id,
      },
      {
        fecha: sale1.fecha,
        usuario: cashier._id,
        producto: prodRoyalCanin._id,
        cantidad: 1,
        stockAnterior: 30,
        stockNuevo: 29,
        motivo: `Venta #${sale1._id}`,
        tipo: 'Salida',
        veterinaria: defaultVet._id,
      },
    ]);

    // Register cash movement for sale
    await CashMovementModel.create({
      tipo: 'Ingreso',
      concepto: `Venta #${sale1._id} (Efectivo)`,
      descripción: 'Registro automático de venta',
      monto: 97.75,
      usuario: cashier._id,
      caja: openRegister._id,
      veterinaria: defaultVet._id,
    });

    console.log('Poblado de base de datos finalizado de manera correcta.');
  } catch (error) {
    console.error('Error poblando la base de datos:', error);
  } finally {
    await mongoose.connection.close();
    console.log('Conexión a la base de datos cerrada.');
  }
};

seedDatabase();
