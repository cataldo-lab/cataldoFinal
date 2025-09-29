"use strict";
import User from "../entity/personas/user.entity.js";
import { AppDataSource } from "../config/configDb.js";
import { tienePermiso } from "../entity/personas/user.entity.js";
import {
  handleErrorClient,
  handleErrorServer,
} from "../handlers/responseHandlers.js";

// ⭐ NUEVO: Middleware genérico que valida permisos múltiples
export async function requireRole(rolesRequeridos) {
  return async (req, res, next) => {
    try {
      const userRepository = AppDataSource.getRepository(User);
      const userFound = await userRepository.findOneBy({ email: req.user.email });

      if (!userFound) {
        return handleErrorClient(res, 404, "Usuario no encontrado en la base de datos");
      }

      // Verificar si el usuario tiene permiso para alguno de los roles requeridos
      const tieneAlgunPermiso = rolesRequeridos.some(rolRequerido => 
        tienePermiso(userFound.rol, rolRequerido)
      );

      if (!tieneAlgunPermiso) {
        return handleErrorClient(
          res,
          403,
          "Acceso denegado",
          `Se requiere uno de los siguientes roles: ${rolesRequeridos.join(", ")}`
        );
      }

      req.userRole = userFound.rol;
      next();
    } catch (error) {
      handleErrorServer(res, 500, error.message);
    }
  };
}

// Middleware para verificar si es administrador
export async function isAdmin(req, res, next) {
  try {
    const userRepository = AppDataSource.getRepository(User);
    const userFound = await userRepository.findOneBy({ email: req.user.email });

    if (!userFound) {
      return handleErrorClient(res, 404, "Usuario no encontrado en la base de datos");
    }

    if (!tienePermiso(userFound.rol, "admin")) {
      return handleErrorClient(
        res,
        403,
        "Acceso denegado",
        "Se requiere rol de administrador para realizar esta acción."
      );
    }
    
    req.userRole = userFound.rol;
    next();
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
}

// ⭐ ACTUALIZADO: Gerente tiene acceso a funciones de gerente
export async function isManager(req, res, next) {
  try {
    const userRepository = AppDataSource.getRepository(User);
    const userFound = await userRepository.findOneBy({ email: req.user.email });

    if (!userFound) {
      return handleErrorClient(res, 404, "Usuario no encontrado en la base de datos");
    }

    if (!tienePermiso(userFound.rol, "gerente")) {
      return handleErrorClient(
        res,
        403,
        "Acceso denegado",
        "Se requiere rol de gerente para realizar esta acción."
      );
    }
    
    req.userRole = userFound.rol;
    next();
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
}

// ⭐ ACTUALIZADO: Trabajador tiene acceso a funciones de trabajador
export async function isEmployee(req, res, next) {
  try {
    const userRepository = AppDataSource.getRepository(User);
    const userFound = await userRepository.findOneBy({ email: req.user.email });

    if (!userFound) {
      return handleErrorClient(res, 404, "Usuario no encontrado en la base de datos");
    }

    if (!tienePermiso(userFound.rol, "trabajador_tienda")) {
      return handleErrorClient(
        res,
        403,
        "Acceso denegado",
        "Se requiere ser empleado de la tienda para realizar esta acción."
      );
    }
    
    req.userRole = userFound.rol;
    next();
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
}

// ⭐ ACTUALIZADO: Cliente puede ser cualquiera con permiso de cliente
export async function isClient(req, res, next) {
  try {
    const userRepository = AppDataSource.getRepository(User);
    const userFound = await userRepository.findOneBy({ email: req.user.email });

    if (!userFound) {
      return handleErrorClient(res, 404, "Usuario no encontrado en la base de datos");
    }

    if (!tienePermiso(userFound.rol, "cliente")) {
      return handleErrorClient(
        res,
        403,
        "Acceso denegado",
        "Esta función está disponible solo para clientes."
      );
    }
    
    req.userRole = userFound.rol;
    next();
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
}

// Middleware para verificar si es el mismo usuario o tiene permisos superiores
export async function isOwnerOrAdmin(req, res, next) {
  try {
    const userRepository = AppDataSource.getRepository(User);
    const userFound = await userRepository.findOneBy({ email: req.user.email });

    if (!userFound) {
      return handleErrorClient(res, 404, "Usuario no encontrado en la base de datos");
    }

    // Si tiene permiso de admin, puede acceder a cualquier recurso
    if (tienePermiso(userFound.rol, "admin")) {
      req.userRole = userFound.rol;
      return next();
    }

    // Si no es admin, verificar si está accediendo a sus propios datos
    const { id, email, rut } = req.query || req.params;
    
    const isAccessingOwnData = 
      (id && userFound.id.toString() === id) ||
      (email && userFound.email === email) ||
      (rut && userFound.rut === rut);

    if (!isAccessingOwnData) {
      return handleErrorClient(
        res,
        403,
        "Acceso denegado",
        "Solo puedes acceder a tus propios datos."
      );
    }

    req.userRole = userFound.rol;
    next();
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
}