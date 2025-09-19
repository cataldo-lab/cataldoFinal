"use strict";
import User from "../entity/personas/user.entity.js";
import { AppDataSource } from "../config/configDb.js";
import {
  handleErrorClient,
  handleErrorServer,
} from "../handlers/responseHandlers.js";

// Middleware para verificar si es administrador
export async function isAdmin(req, res, next) {
  try {
    const userRepository = AppDataSource.getRepository(User);
    const userFound = await userRepository.findOneBy({ email: req.user.email });

    if (!userFound) {
      return handleErrorClient(res, 404, "Usuario no encontrado en la base de datos");
    }

    if (userFound.rol !== "administrador") {
      return handleErrorClient(
        res,
        403,
        "Acceso denegado",
        "Se requiere rol de administrador para realizar esta acción."
      );
    }
    next();
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
}

// Middleware para verificar si es gerente o admin
export async function isManager(req, res, next) {
  try {
    const userRepository = AppDataSource.getRepository(User);
    const userFound = await userRepository.findOneBy({ email: req.user.email });

    if (!userFound) {
      return handleErrorClient(res, 404, "Usuario no encontrado en la base de datos");
    }

    const allowedRoles = ["administrador", "gerente"];
    if (!allowedRoles.includes(userFound.rol)) {
      return handleErrorClient(
        res,
        403,
        "Acceso denegado",
        "Se requiere rol de gerente o administrador para realizar esta acción."
      );
    }
    
    req.userRole = userFound.rol;
    next();
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
}

// Middleware para verificar si es trabajador de tienda, gerente o admin
export async function isEmployee(req, res, next) {
  try {
    const userRepository = AppDataSource.getRepository(User);
    const userFound = await userRepository.findOneBy({ email: req.user.email });

    if (!userFound) {
      return handleErrorClient(res, 404, "Usuario no encontrado en la base de datos");
    }

    const allowedRoles = ["administrador", "gerente", "trabajador_tienda"];
    if (!allowedRoles.includes(userFound.rol)) {
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

// Middleware para verificar si es cliente registrado
export async function isClient(req, res, next) {
  try {
    const userRepository = AppDataSource.getRepository(User);
    const userFound = await userRepository.findOneBy({ email: req.user.email });

    if (!userFound) {
      return handleErrorClient(res, 404, "Usuario no encontrado en la base de datos");
    }

    const allowedRoles = ["cliente", "usuario"];
    if (!allowedRoles.includes(userFound.rol)) {
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

    // Si es admin o gerente, puede acceder a cualquier recurso
    if (["administrador", "gerente"].includes(userFound.rol)) {
      req.userRole = userFound.rol;
      return next();
    }

    // Si no es admin/gerente, verificar si está accediendo a sus propios datos
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
