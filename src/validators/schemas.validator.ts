import { body, param } from 'express-validator';
import { ROLES_LIST } from '../constants/roles';

export const validateMongoId = (paramName: string) => [
  param(paramName).isMongoId().withMessage(`El parámetro ${paramName} debe ser un ID de MongoDB válido.`)
];

export const authValidators = {
  login: [
    body('usuario').trim().notEmpty().withMessage('El usuario es obligatorio.'),
    body('contraseña').trim().notEmpty().withMessage('La contraseña es obligatoria.'),
  ],
  changePassword: [
    body('contraseñaActual').trim().notEmpty().withMessage('La contraseña actual es obligatoria.'),
    body('contraseñaNueva').trim().isLength({ min: 6 }).withMessage('La nueva contraseña debe tener al menos 6 caracteres.'),
  ],
  register: [
    body('vetNombre').trim().notEmpty().withMessage('El nombre de la veterinaria es obligatorio.'),
    body('vetRUC').trim().notEmpty().withMessage('El RUC de la veterinaria es obligatorio.'),
    body('vetDirección').optional().trim(),
    body('vetTeléfono').optional().trim(),
    body('vetEmail').trim().isEmail().withMessage('Debe proporcionar un correo electrónico válido para la veterinaria.'),
    body('adminNombres').trim().notEmpty().withMessage('Los nombres del administrador son obligatorios.'),
    body('adminApellidos').trim().notEmpty().withMessage('Los apellidos del administrador son obligatorios.'),
    body('adminEmail').trim().isEmail().withMessage('Debe proporcionar un correo electrónico válido para el administrador.'),
    body('adminUsuario').trim().isLength({ min: 4 }).withMessage('El usuario del administrador debe tener al menos 4 caracteres.'),
    body('adminTeléfono').trim().notEmpty().withMessage('El teléfono del administrador es obligatorio.'),
  ],
};

export const userValidators = {
  create: [
    body('nombres').trim().notEmpty().withMessage('Los nombres son obligatorios.'),
    body('apellidos').trim().notEmpty().withMessage('Los apellidos son obligatorios.'),
    body('email').trim().isEmail().withMessage('Debe proporcionar un correo electrónico válido.'),
    body('teléfono').trim().notEmpty().withMessage('El teléfono es obligatorio.'),
    body('usuario').trim().isLength({ min: 4 }).withMessage('El usuario debe tener al menos 4 caracteres.'),
    body('contraseña').trim().isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres.'),
    body('rol').trim().isIn(ROLES_LIST).withMessage(`El rol debe ser uno de los siguientes: ${ROLES_LIST.join(', ')}`),
    body('estado').optional().isIn(['Activo', 'Inactivo']).withMessage('El estado debe ser Activo o Inactivo.'),
    body('tipoComisión').optional().isIn(['Principal', 'Secundario']).withMessage('El tipo de comisión debe ser Principal o Secundario.'),
  ],
  update: [
    body('nombres').optional().trim().notEmpty().withMessage('Los nombres no pueden estar vacíos.'),
    body('apellidos').optional().trim().notEmpty().withMessage('Los apellidos no pueden estar vacíos.'),
    body('email').optional().trim().isEmail().withMessage('Debe proporcionar un correo electrónico válido.'),
    body('teléfono').optional().trim().notEmpty().withMessage('El teléfono no puede estar vacío.'),
    body('usuario').optional().trim().isLength({ min: 4 }).withMessage('El usuario debe tener al menos 4 caracteres.'),
    body('contraseña').optional().trim().isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres.'),
    body('rol').optional().trim().isIn(ROLES_LIST).withMessage(`El rol debe ser uno de los siguientes: ${ROLES_LIST.join(', ')}`),
    body('estado').optional().isIn(['Activo', 'Inactivo']).withMessage('El estado debe ser Activo o Inactivo.'),
    body('tipoComisión').optional().isIn(['Principal', 'Secundario']).withMessage('El tipo de comisión debe ser Principal o Secundario.'),
  ],
};

export const clientValidators = {
  create: [
    body('nombres').trim().notEmpty().withMessage('Los nombres son obligatorios.'),
    body('apellidos').trim().notEmpty().withMessage('Los apellidos son obligatorios.'),
    body('cédula').trim().notEmpty().withMessage('La cédula es obligatoria.'),
    body('teléfono').trim().notEmpty().withMessage('El teléfono es obligatorio.'),
    body('email').trim().isEmail().withMessage('Debe proporcionar un correo electrónico válido.'),
    body('dirección').trim().notEmpty().withMessage('La dirección es obligatoria.'),
    body('observaciones').optional().trim(),
    body('estado').optional().isIn(['Activo', 'Inactivo']).withMessage('El estado debe ser Activo o Inactivo.'),
  ],
  update: [
    body('nombres').optional().trim().notEmpty().withMessage('Los nombres no pueden estar vacíos.'),
    body('apellidos').optional().trim().notEmpty().withMessage('Los apellidos no pueden estar vacíos.'),
    body('cédula').optional().trim().notEmpty().withMessage('La cédula no puede estar vacía.'),
    body('teléfono').optional().trim().notEmpty().withMessage('El teléfono no puede estar vacío.'),
    body('email').optional().trim().isEmail().withMessage('Debe proporcionar un correo electrónico válido.'),
    body('dirección').optional().trim().notEmpty().withMessage('La dirección no puede estar vacía.'),
    body('observaciones').optional().trim(),
    body('estado').optional().isIn(['Activo', 'Inactivo']).withMessage('El estado debe ser Activo o Inactivo.'),
  ],
};

export const petValidators = {
  create: [
    body('nombre').trim().notEmpty().withMessage('El nombre de la mascota es obligatorio.'),
    body('especie').trim().notEmpty().withMessage('La especie es obligatoria.'),
    body('raza').trim().notEmpty().withMessage('La raza es obligatoria.'),
    body('sexo').trim().isIn(['Macho', 'Hembra']).withMessage('El sexo debe ser Macho o Hembra.'),
    body('edad').optional().trim(),
    body('fechaNacimiento').isISO8601().withMessage('Debe proporcionar una fecha de nacimiento válida (YYYY-MM-DD).'),
    body('peso').isFloat({ min: 0.01 }).withMessage('El peso debe ser un número decimal mayor a 0.'),
    body('color').trim().notEmpty().withMessage('El color es obligatorio.'),
    body('observaciones').optional().trim(),
    body('propietario').isMongoId().withMessage('El propietario debe ser un ID de cliente válido.'),
  ],
  update: [
    body('nombre').optional().trim().notEmpty().withMessage('El nombre no puede estar vacío.'),
    body('especie').optional().trim().notEmpty().withMessage('La especie no puede estar vacía.'),
    body('raza').optional().trim().notEmpty().withMessage('La raza no puede estar vacía.'),
    body('sexo').optional().trim().isIn(['Macho', 'Hembra']).withMessage('El sexo debe ser Macho o Hembra.'),
    body('edad').optional().trim(),
    body('fechaNacimiento').optional().isISO8601().withMessage('Debe proporcionar una fecha de nacimiento válida.'),
    body('peso').optional().isFloat({ min: 0.01 }).withMessage('El peso debe ser un número decimal mayor a 0.'),
    body('color').optional().trim().notEmpty().withMessage('El color no puede estar vacío.'),
    body('observaciones').optional().trim(),
    body('propietario').optional().isMongoId().withMessage('El propietario debe ser un ID de cliente válido.'),
  ],
};

export const categoryValidators = {
  create: [
    body('nombre').trim().notEmpty().withMessage('El nombre de la categoría es obligatorio.'),
    body('descripción').optional().trim(),
    body('estado').optional().isIn(['Activo', 'Inactivo']).withMessage('El estado debe ser Activo o Inactivo.'),
    body('comisiónPrincipal').optional().isFloat({ min: 0, max: 100 }).withMessage('La comisión principal debe estar entre 0 y 100.'),
    body('comisiónSecundario').optional().isFloat({ min: 0, max: 100 }).withMessage('La comisión secundaria debe estar entre 0 y 100.'),
  ],
  update: [
    body('nombre').optional().trim().notEmpty().withMessage('El nombre no puede estar vacío.'),
    body('descripción').optional().trim(),
    body('estado').optional().isIn(['Activo', 'Inactivo']).withMessage('El estado debe ser Activo o Inactivo.'),
    body('comisiónPrincipal').optional().isFloat({ min: 0, max: 100 }).withMessage('La comisión principal debe estar entre 0 y 100.'),
    body('comisiónSecundario').optional().isFloat({ min: 0, max: 100 }).withMessage('La comisión secundaria debe estar entre 0 y 100.'),
  ],
};

export const productValidators = {
  create: [
    body('código').trim().notEmpty().withMessage('El código de producto es obligatorio.'),
    body('nombre').trim().notEmpty().withMessage('El nombre del producto es obligatorio.'),
    body('descripción').optional().trim(),
    body('categoría').isMongoId().withMessage('La categoría debe ser un ID válido.'),
    body('precioCompra').isFloat({ min: 0 }).withMessage('El precio de compra debe ser un número positivo.'),
    body('precioVenta').isFloat({ min: 0 }).withMessage('El precio de venta debe ser un número positivo.'),
    body('stock').isInt({ min: 0 }).withMessage('El stock inicial debe ser un número entero positivo.'),
    body('stockMínimo').isInt({ min: 0 }).withMessage('El stock mínimo debe ser un número entero positivo.'),
    body('unidad').trim().notEmpty().withMessage('La unidad (ej. Kg, Unidad) es obligatoria.'),
    body('proveedor').trim().notEmpty().withMessage('El proveedor es obligatorio.'),
    body('estado').optional().isIn(['Activo', 'Inactivo']).withMessage('El estado debe ser Activo o Inactivo.'),
    body('tieneIva').optional().isBoolean().withMessage('tieneIva debe ser un booleano.'),
    body('comisiónPrincipal').optional().isFloat({ min: 0, max: 100 }).withMessage('La comisión principal debe estar entre 0 y 100.'),
    body('comisiónSecundario').optional().isFloat({ min: 0, max: 100 }).withMessage('La comisión secundaria debe estar entre 0 y 100.'),
  ],
  update: [
    body('código').optional().trim().notEmpty().withMessage('El código no puede estar vacío.'),
    body('nombre').optional().trim().notEmpty().withMessage('El nombre no puede estar vacío.'),
    body('descripción').optional().trim(),
    body('categoría').optional().isMongoId().withMessage('La categoría debe ser un ID válido.'),
    body('precioCompra').optional().isFloat({ min: 0 }).withMessage('El precio de compra debe ser un número positivo.'),
    body('precioVenta').optional().isFloat({ min: 0 }).withMessage('El precio de venta debe ser un número positivo.'),
    body('stock').optional().isInt({ min: 0 }).withMessage('El stock debe ser un número entero positivo.'),
    body('stockMínimo').optional().isInt({ min: 0 }).withMessage('El stock mínimo debe ser un número entero positivo.'),
    body('unidad').optional().trim().notEmpty().withMessage('La unidad no puede estar vacía.'),
    body('proveedor').optional().trim().notEmpty().withMessage('El proveedor no puede estar vacío.'),
    body('estado').optional().isIn(['Activo', 'Inactivo']).withMessage('El estado debe ser Activo o Inactivo.'),
    body('tieneIva').optional().isBoolean().withMessage('tieneIva debe ser un booleano.'),
    body('comisiónPrincipal').optional().isFloat({ min: 0, max: 100 }).withMessage('La comisión principal debe estar entre 0 y 100.'),
    body('comisiónSecundario').optional().isFloat({ min: 0, max: 100 }).withMessage('La comisión secundaria debe estar entre 0 y 100.'),
  ],
};

export const serviceValidators = {
  create: [
    body('nombre').trim().notEmpty().withMessage('El nombre del servicio es obligatorio.'),
    body('descripción').optional().trim(),
    body('precio').isFloat({ min: 0 }).withMessage('El precio debe ser un número positivo.'),
    body('duración').trim().notEmpty().withMessage('La duración del servicio es obligatoria.'),
    body('estado').optional().isIn(['Activo', 'Inactivo']).withMessage('El estado debe ser Activo o Inactivo.'),
    body('tieneIva').optional().isBoolean().withMessage('tieneIva debe ser un booleano.'),
    body('comisiónPrincipal').optional().isFloat({ min: 0, max: 100 }).withMessage('La comisión principal debe estar entre 0 y 100.'),
    body('comisiónSecundario').optional().isFloat({ min: 0, max: 100 }).withMessage('La comisión secundaria debe estar entre 0 y 100.'),
  ],
  update: [
    body('nombre').optional().trim().notEmpty().withMessage('El nombre no puede estar vacío.'),
    body('descripción').optional().trim(),
    body('precio').optional().isFloat({ min: 0 }).withMessage('El precio debe ser un número positivo.'),
    body('duración').optional().trim().notEmpty().withMessage('La duración no puede estar vacía.'),
    body('estado').optional().isIn(['Activo', 'Inactivo']).withMessage('El estado debe ser Activo o Inactivo.'),
    body('tieneIva').optional().isBoolean().withMessage('tieneIva debe ser un booleano.'),
    body('comisiónPrincipal').optional().isFloat({ min: 0, max: 100 }).withMessage('La comisión principal debe estar entre 0 y 100.'),
    body('comisiónSecundario').optional().isFloat({ min: 0, max: 100 }).withMessage('La comisión secundaria debe estar entre 0 y 100.'),
  ],
};

export const cashRegisterValidators = {
  open: [
    body('montoInicial').isFloat({ min: 0 }).withMessage('El monto inicial de apertura debe ser un número mayor o igual a 0.'),
  ],
  close: [
    body('efectivoContado').isFloat({ min: 0 }).withMessage('El efectivo contado al cierre debe ser un número mayor o igual a 0.'),
  ],
  manualMovement: [
    body('tipo').isIn(['Ingreso', 'Egreso']).withMessage('El tipo de movimiento debe ser Ingreso o Egreso.'),
    body('concepto').trim().notEmpty().withMessage('El concepto es obligatorio.'),
    body('monto').isFloat({ min: 0.01 }).withMessage('El monto del movimiento debe ser un número decimal mayor a 0.'),
    body('descripción').optional().trim(),
  ],
};

export const saleValidators = {
  create: [
    body('cliente').isMongoId().withMessage('El cliente debe ser un ID válido.'),
    body('descuento').optional().isFloat({ min: 0 }).withMessage('El descuento debe ser un número positivo.'),
    body('métodoPago').isIn(['Efectivo', 'Tarjeta', 'Transferencia']).withMessage('El método de pago debe ser Efectivo, Tarjeta o Transferencia.'),
    body('observaciones').optional().trim(),
    body('comprobanteUrl').optional().trim(),
    body('referenciaTransferencia').optional().trim(),
    body('detalles').isArray({ min: 1 }).withMessage('La venta debe contener al menos un detalle de producto.'),
    body('detalles.*.tipo').isIn(['Producto']).withMessage('El tipo del detalle debe ser Producto.'),
    body('detalles.*.cantidad').isInt({ min: 1 }).withMessage('La cantidad de cada detalle debe ser un número entero mayor o igual a 1.'),
    body('detalles.*.producto').isMongoId().withMessage('El ID de producto debe ser un ID válido.'),
    body('detalles.*.comisiónPrincipal').optional().isFloat({ min: 0, max: 100 }).withMessage('La comisión principal debe estar entre 0 y 100.'),
    body('detalles.*.comisiónSecundario').optional().isFloat({ min: 0, max: 100 }).withMessage('La comisión secundaria debe estar entre 0 y 100.'),
  ],
};
