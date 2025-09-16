// backend/src/middlewares/authorization.middleware.js
"use strict";
import User from "../entity/personas/user.entity.js";
import { AppDataSource } from "../config/configDb.js";
import {
  handleErrorClient,
  handleErrorServer,
} from "../handlers/responseHandlers.js";

// Definir roles y sus jerarquías
export const ROLES = {
  ADMIN: "administrador",
  GERENTE: "gerente",
  TRABAJADOR_TIENDA: "trabajador_tienda",
  CLIENTE: "cliente",
  USUARIO: "usuario"
};

// Definir jerarquía de roles (mayor número = mayor privilegio)
const ROLE_HIERARCHY = {
  [ROLES.USUARIO]: 1,
  [ROLES.CLIENTE]: 2,
  [ROLES.TRABAJADOR_TIENDA]: 3,
  [ROLES.GERENTE]: 4,
  [ROLES.ADMIN]: 5
};

// Middleware genérico para verificar roles
export function requireRole(allowedRoles) {
  return async (req, res, next) => {
    try {
      const userRepository = AppDataSource.getRepository(User);
      
      const userFound = await userRepository.findOneBy({ 
        email: req.user.email 
      });

      if (!userFound) {
        return handleErrorClient(
          res,
          404,
          "Usuario no encontrado en la base de datos"
        );
      }

      const userRole = userFound.rol;

      // Si allowedRoles es un string, convertirlo a array
      const rolesArray = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];

      // Verificar si el usuario tiene uno de los roles permitidos
      const hasPermission = rolesArray.includes(userRole);

      if (!hasPermission) {
        return handleErrorClient(
          res,
          403,
          "Acceso denegado",
          {
            message: "No tienes permisos suficientes para realizar esta acción",
            requiredRoles: rolesArray,
            userRole: userRole
          }
        );
      }

      // Agregar información del rol al request para uso posterior
      req.userRole = userRole;
      req.roleLevel = ROLE_HIERARCHY[userRole] || 0;
      
      next();
    } catch (error) {
      handleErrorServer(
        res,
        500,
        error.message
      );
    }
  };
}

// Middleware para verificar jerarquía de roles (nivel mínimo requerido)
export function requireMinimumRole(minimumRole) {
  return async (req, res, next) => {
    try {
      const userRepository = AppDataSource.getRepository(User);
      
      const userFound = await userRepository.findOneBy({ 
        email: req.user.email 
      });

      if (!userFound) {
        return handleErrorClient(
          res,
          404,
          "Usuario no encontrado en la base de datos"
        );
      }

      const userRole = userFound.rol;
      const userLevel = ROLE_HIERARCHY[userRole] || 0;
      const requiredLevel = ROLE_HIERARCHY[minimumRole] || 0;

      if (userLevel < requiredLevel) {
        return handleErrorClient(
          res,
          403,
          "Acceso denegado",
          {
            message: `Se requiere nivel de acceso ${minimumRole} o superior`,
            userRole: userRole,
            requiredRole: minimumRole
          }
        );
      }

      req.userRole = userRole;
      req.roleLevel = userLevel;
      
      next();
    } catch (error) {
      handleErrorServer(
        res,
        500,
        error.message
      );
    }
  };
}

// Middlewares específicos para cada rol
export const isAdmin = requireRole(ROLES.ADMIN);

export const isGerente = requireRole(ROLES.GERENTE);

export const isTrabajadorTienda = requireRole(ROLES.TRABAJADOR_TIENDA);

export const isCliente = requireRole(ROLES.CLIENTE);

// Middlewares combinados para múltiples roles
export const isAdminOrGerente = requireRole([ROLES.ADMIN, ROLES.GERENTE]);

export const isStaff = requireRole([ROLES.ADMIN, ROLES.GERENTE, ROLES.TRABAJADOR_TIENDA]);

export const isRegisteredUser = requireRole([
  ROLES.ADMIN, 
  ROLES.GERENTE, 
  ROLES.TRABAJADOR_TIENDA, 
  ROLES.CLIENTE
]);

// Middleware para verificar que el usuario puede acceder a sus propios datos o es staff
export function canAccessUserData(req, res, next) {
  try {
    const { rut, id, email } = req.query;
    const userRole = req.user.rol;
    const userLevel = ROLE_HIERARCHY[userRole] || 0;

    // Staff puede acceder a datos de cualquier usuario
    if (userLevel >= ROLE_HIERARCHY[ROLES.TRABAJADOR_TIENDA]) {
      return next();
    }

    // Los usuarios solo pueden acceder a sus propios datos
    const requestingOwnData = (
      (rut && req.user.rut === rut) ||
      (id && req.user.id === parseInt(id)) ||
      (email && req.user.email === email)
    );

    if (!requestingOwnData) {
      return handleErrorClient(
        res,
        403,
        "Acceso denegado",
        {
          message: "Solo puedes acceder a tu propia información"
        }
      );
    }

    next();
  } catch (error) {
    handleErrorServer(
      res,
      500,
      error.message
    );
  }
}

// Middleware para verificar permisos de operación (CRUD)
export function checkOperationPermission(operation, resource) {
  return async (req, res, next) => {
    try {
      const userRepository = AppDataSource.getRepository(User);
      
      const userFound = await userRepository.findOneBy({ 
        email: req.user.email 
      });

      if (!userFound) {
        return handleErrorClient(
          res,
          404,
          "Usuario no encontrado en la base de datos"
        );
      }

      const userRole = userFound.rol;
      const hasPermission = checkPermission(userRole, operation, resource);

      if (!hasPermission) {
        return handleErrorClient(
          res,
          403,
          "Acceso denegado",
          {
            message: `No tienes permisos para ${operation} en ${resource}`,
            userRole: userRole,
            operation: operation,
            resource: resource
          }
        );
      }

      req.userRole = userRole;
      next();
    } catch (error) {
      handleErrorServer(
        res,
        500,
        error.message
      );
    }
  };
}

// Función para verificar permisos específicos
function checkPermission(userRole, operation, resource) {
  const permissions = {
    [ROLES.ADMIN]: {
      users: ['create', 'read', 'update', 'delete'],
      productos: ['create', 'read', 'update', 'delete'],
      operaciones: ['create', 'read', 'update', 'delete'],
      materiales: ['create', 'read', 'update', 'delete'],
      proveedores: ['create', 'read', 'update', 'delete'],
      reportes: ['create', 'read', 'update', 'delete']
    },
    [ROLES.GERENTE]: {
      users: ['read', 'update'],
      productos: ['create', 'read', 'update', 'delete'],
      operaciones: ['create', 'read', 'update', 'delete'],
      materiales: ['create', 'read', 'update', 'delete'],
      proveedores: ['create', 'read', 'update', 'delete'],
      reportes: ['read']
    },
    [ROLES.TRABAJADOR_TIENDA]: {
      users: ['read'],
      productos: ['read', 'update'],
      operaciones: ['create', 'read', 'update'],
      materiales: ['read', 'update'],
      proveedores: ['read'],
      reportes: []
    },
    [ROLES.CLIENTE]: {
      users: ['read'], // Solo sus propios datos
      productos: ['read'],
      operaciones: ['create', 'read'], // Solo sus propias operaciones
      materiales: [],
      proveedores: [],
      reportes: []
    },
    [ROLES.USUARIO]: {
      users: ['read'], // Solo sus propios datos
      productos: ['read'],
      operaciones: [],
      materiales: [],
      proveedores: [],
      reportes: []
    }
  };

  const userPermissions = permissions[userRole] || {};
  const resourcePermissions = userPermissions[resource] || [];
  
  return resourcePermissions.includes(operation);
}

// Middleware para logging de accesos
export function logAccess(req, res, next) {
  const timestamp = new Date().toISOString();
  const userEmail = req.user?.email || 'Anonymous';
  const userRole = req.user?.rol || 'Unknown';
  const method = req.method;
  const path = req.path;
  
  console.log(`[${timestamp}] ${userEmail} (${userRole}) - ${method} ${path}`);
  
  next();
}

// Funciones utilitarias para verificar roles programáticamente
export function hasRole(user, role) {
  return user.rol === role;
}

export function hasAnyRole(user, roles) {
  return roles.includes(user.rol);
}

export function hasMinimumRole(user, minimumRole) {
  const userLevel = ROLE_HIERARCHY[user.rol] || 0;
  const requiredLevel = ROLE_HIERARCHY[minimumRole] || 0;
  return userLevel >= requiredLevel;
}

export function getRoleLevel(role) {
  return ROLE_HIERARCHY[role] || 0;
}

// ========================================
// EJEMPLO DE RUTAS CON AUTORIZACIÓN
// ========================================

// backend/src/routes/user.routes.js - VERSIÓN MEJORADA
/*
"use strict";
import { Router } from "express";
import { 
  isAdmin, 
  isStaff, 
  canAccessUserData,
  requireMinimumRole,
  ROLES,
  logAccess
} from "../middlewares/authorization.middleware.js";
import { authenticateJwt } from "../middlewares/authentication.middleware.js";
import {
  deleteUser,
  getUser,
  getUsers,
  updateUser,
} from "../controllers/user.controller.js";

const router = Router();

// Aplicar autenticación a todas las rutas
router.use(authenticateJwt);

// Aplicar logging a todas las rutas (opcional)
router.use(logAccess);

// Rutas para gestión de usuarios
router
  .get("/", isStaff, getUsers) // Solo staff puede ver todos los usuarios
  .get("/detail/", canAccessUserData, getUser) // Usuarios pueden ver sus propios datos o staff puede ver cualquiera
  .patch("/detail/", canAccessUserData, updateUser) // Solo el usuario puede actualizar sus datos o staff
  .delete("/detail/", isAdmin, deleteUser); // Solo admin puede eliminar usuarios

export default router;
*/

// ========================================
// EJEMPLO DE RUTAS PARA PRODUCTOS
// ========================================

// backend/src/routes/producto.routes.js - NUEVO
/*
"use strict";
import { Router } from "express";
import { 
  isAdmin,
  isGerente, 
  isStaff,
  requireMinimumRole,
  checkOperationPermission,
  ROLES
} from "../middlewares/authorization.middleware.js";
import { authenticateJwt } from "../middlewares/authentication.middleware.js";
import {
  createProducto,
  getProductos,
  getProducto,
  updateProducto,
  deleteProducto,
} from "../controllers/producto.controller.js";

const router = Router();

router.use(authenticateJwt);

router
  .get("/", getProductos) // Todos los usuarios autenticados pueden ver productos
  .get("/:id", getProducto) // Todos los usuarios autenticados pueden ver un producto específico
  .post("/", checkOperationPermission('create', 'productos'), createProducto) // Solo gerente y admin
  .put("/:id", checkOperationPermission('update', 'productos'), updateProducto) // Gerente, admin y trabajadores
  .delete("/:id", isAdmin, deleteProducto); // Solo admin

export default router;
*/

// ========================================
// EJEMPLO DE RUTAS PARA OPERACIONES
// ========================================

// backend/src/routes/operacion.routes.js - NUEVO  
/*
"use strict";
import { Router } from "express";
import { 
  isStaff,
  requireRole,
  checkOperationPermission,
  ROLES
} from "../middlewares/authorization.middleware.js";
import { authenticateJwt } from "../middlewares/authentication.middleware.js";
import {
  createOperacion,
  getOperaciones,
  getOperacion,
  updateOperacion,
  deleteOperacion,
} from "../controllers/operacion.controller.js";

const router = Router();

router.use(authenticateJwt);

router
  .get("/", isStaff, getOperaciones) // Solo staff puede ver todas las operaciones
  .get("/mis-operaciones", requireRole(ROLES.CLIENTE), getMisOperaciones) // Clientes ven solo sus operaciones
  .get("/:id", getOperacion) // Verificación dentro del controller según el usuario
  .post("/", requireRole([ROLES.CLIENTE, ...Object.values(ROLES).filter(r => r !== ROLES.USUARIO)]), createOperacion)
  .put("/:id", isStaff, updateOperacion) // Solo staff puede modificar operaciones
  .delete("/:id", requireRole([ROLES.ADMIN, ROLES.GERENTE]), deleteOperacion); // Solo admin y gerente

export default router;
*/

// ========================================
// CONTROLADOR EJEMPLO CON VERIFICACIONES ADICIONALES
// ========================================

// backend/src/controllers/operacion.controller.js - EJEMPLO
/*
export async function getOperacion(req, res) {
  try {
    const { id } = req.params;
    const userRole = req.user.rol;
    const userEmail = req.user.email;

    const operacion = await getOperacionService(id);
    
    if (!operacion) {
      return handleErrorClient(res, 404, "Operación no encontrada");
    }

    // Si es cliente, solo puede ver sus propias operaciones
    if (userRole === ROLES.CLIENTE) {
      if (operacion.cliente.email !== userEmail) {
        return handleErrorClient(
          res, 
          403, 
          "No tienes permisos para ver esta operación"
        );
      }
    }

    handleSuccess(res, 200, "Operación encontrada", operacion);
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
}
*/