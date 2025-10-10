
"use strict";
import { loginService, registerService } from "../services/auth.service.js";
import {
  authValidation,
  registerValidation,
} from "../validations/auth.validation.js";
import {
  handleErrorClient,
  handleErrorServer,
  handleSuccess,
} from "../handlers/responseHandlers.js";
// ✅ AGREGAR ESTOS IMPORTS
import { logAuditEvent, TipoEvento, NivelSeveridad } from "../services/audit.service.js";

export async function login(req, res) {
  try {
    const { body } = req;
    // ✅ AGREGAR: Capturar IP y User Agent
    const ip = req.ip || req.connection.remoteAddress;
    const userAgent = req.headers['user-agent'];

    const { error } = authValidation.validate(body);

    if (error) {
      // ✅ AGREGAR: Registrar error de validación
      await logAuditEvent({
        tipo: TipoEvento.LOGIN_FAILED,
        email: body.email || null,
        ip: ip,
        userAgent: userAgent,
        descripcion: `Error de validación en login: ${error.message}`,
        nivel: NivelSeveridad.WARNING,
        exito: false
      });

      return handleErrorClient(res, 400, "Error de validación", error.message);
    }
    
    const [accessToken, errorToken] = await loginService(body);

    if (errorToken) {
      // ✅ AGREGAR: Registrar login fallido
      await logAuditEvent({
        tipo: TipoEvento.LOGIN_FAILED,
        email: body.email,
        ip: ip,
        userAgent: userAgent,
        descripcion: `Login fallido: ${errorToken}`,
        nivel: NivelSeveridad.WARNING,
        exito: false
      });

      return handleErrorClient(res, 400, "Error iniciando sesión", errorToken);
    }

    // ✅ AGREGAR: Registrar login exitoso
    await logAuditEvent({
      tipo: TipoEvento.LOGIN,
      email: body.email,
      ip: ip,
      userAgent: userAgent,
      descripcion: "Inicio de sesión exitoso",
      nivel: NivelSeveridad.INFO,
      exito: true
    });

    // Configurar cookie con opciones de seguridad mejoradas
    res.cookie("jwt", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 24 * 60 * 60 * 1000,
    });

    // Devolver respuesta con el token también en el cuerpo para compatibilidad
    handleSuccess(res, 200, "Inicio de sesión exitoso", { 
      message: "Sesión iniciada correctamente",
      token: accessToken
    });
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
}

export async function register(req, res) {
  try {
    const { body } = req;
    // ✅ AGREGAR: Capturar IP
    const ip = req.ip || req.connection.remoteAddress;

    const { error } = registerValidation.validate(body);

    if (error)
      return handleErrorClient(res, 400, "Error de validación", error.message);

    const [newUser, errorNewUser] = await registerService(body);

    if (errorNewUser) return handleErrorClient(res, 400, "Error registrando al usuario", errorNewUser);

    // ✅ AGREGAR: Registrar usuario creado mediante registro público
    await logAuditEvent({
      tipo: TipoEvento.USER_CREATED,
      email: newUser.email,
      ip: ip,
      descripcion: `Usuario registrado públicamente: ${newUser.email}`,
      entidad: "User",
      idEntidad: newUser.id,
      datosDespues: {
        email: newUser.email,
        nombreCompleto: newUser.nombreCompleto,
        rol: newUser.rol,
        rut: newUser.rut
      },
      nivel: NivelSeveridad.INFO,
      exito: true
    });

    handleSuccess(res, 201, "Usuario registrado con éxito", newUser);
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
}

export async function logout(req, res) {
  try {
    // ✅ AGREGAR: Capturar email e IP
    const email = req.user?.email; // Viene del middleware authenticateJwt
    const ip = req.ip || req.connection.remoteAddress;

    // ✅ AGREGAR: Registrar logout (solo si hay usuario autenticado)
    if (email) {
      await logAuditEvent({
        tipo: TipoEvento.LOGOUT,
        email: email,
        ip: ip,
        descripcion: "Cierre de sesión",
        nivel: NivelSeveridad.INFO,
        exito: true
      });
    }

    // Limpiar la cookie JWT
    res.clearCookie("jwt", { 
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict'
    });
    
    handleSuccess(res, 200, "Sesión cerrada exitosamente");
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
}