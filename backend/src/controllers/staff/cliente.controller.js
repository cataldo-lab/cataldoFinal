"use strict";
import {
  blockUserCliente, 
  getAllClientes, 
  getClienteById, 
  getUserById, 
  getClienteDetalleById, 
  createPerfilFull, 
  createMedioPerfil, 
  updateMedioPerfil, 
  updatePerfilFull 
} from "../../services/staff/cliente.service.js";

// Controlador para obtener todos los clientes
export async function getAllClientes(req, res) {
  try {
    const clientes = await clienteService.getAllClientes();
    return res.status(200).json({
      success: true,
      message: "Clientes obtenidos exitosamente",
      data: clientes
    });
  } catch (error) {
    console.error("Error al obtener clientes:", error);
    return res.status(500).json({
      success: false,
      message: "Error al obtener clientes",
      error: error.message
    });
  }
}

// Controlador para obtener un cliente por ID con todos sus datos
export async function getClienteById(req, res) {
  try {
    const { id } = req.params;
    const cliente = await clienteService.getClienteById(parseInt(id));
    
    if (!cliente) {
      return res.status(404).json({
        success: false,
        message: `No se encontró cliente con ID ${id}`
      });
    }
    
    return res.status(200).json({
      success: true,
      message: "Cliente obtenido exitosamente",
      data: cliente
    });
  } catch (error) {
    console.error(`Error al obtener cliente ${req.params.id}:`, error);
    return res.status(500).json({
      success: false,
      message: "Error al obtener cliente",
      error: error.message
    });
  }
}

// Controlador para obtener datos básicos de usuario (parte 1 del perfil)
export async function getUserById(req, res) {
  try {
    const { id } = req.params;
    const usuario = await clienteService.getUserById(parseInt(id));
    
    if (!usuario) {
      return res.status(404).json({
        success: false,
        message: `No se encontró usuario con ID ${id}`
      });
    }
    
    return res.status(200).json({
      success: true,
      message: "Datos de usuario obtenidos exitosamente",
      data: usuario
    });
  } catch (error) {
    console.error(`Error al obtener datos de usuario ${req.params.id}:`, error);
    return res.status(500).json({
      success: false,
      message: "Error al obtener datos de usuario",
      error: error.message
    });
  }
}

// Controlador para obtener detalles específicos de cliente (parte 2 del perfil)
export async function getClienteDetalleById(req, res) {
  try {
    const { id } = req.params;
    const resultado = await clienteService.getClienteDetalleById(parseInt(id));
    
    // Como getClienteDetalleById ya devuelve un objeto estructurado, lo pasamos directamente
    return res.status(resultado.success ? 200 : 404).json(resultado);
  } catch (error) {
    console.error(`Error al obtener detalles de cliente ${req.params.id}:`, error);
    return res.status(500).json({
      success: false,
      message: "Error al obtener detalles de cliente",
      error: error.message
    });
  }
}

// Controlador para crear un perfil completo (usuario + cliente)
export async function createPerfilFull(req, res) {
  try {
    const { userData, clienteData } = req.body;
    
    // Validar que vengan ambos objetos de datos
    if (!userData || !clienteData) {
      return res.status(400).json({
        success: false,
        message: "Se requieren datos de usuario y cliente para crear perfil completo"
      });
    }
    
    const resultado = await clienteService.createPerfilFull(userData, clienteData);
    
    return res.status(resultado.success ? 201 : 400).json(resultado);
  } catch (error) {
    console.error("Error al crear perfil completo:", error);
    return res.status(500).json({
      success: false,
      message: "Error al crear perfil completo",
      error: error.message
    });
  }
}

// Controlador para crear perfil de cliente para usuario existente
export async function createMedioPerfil(req, res) {
  try {
    const { id } = req.params;
    const { clienteData } = req.body;
    
    if (!clienteData) {
      return res.status(400).json({
        success: false,
        message: "Se requieren datos de cliente para crear perfil"
      });
    }
    
    const resultado = await clienteService.createMedioPerfil(parseInt(id), clienteData);
    
    return res.status(resultado.success ? 201 : 400).json(resultado);
  } catch (error) {
    console.error(`Error al crear medio perfil para usuario ${req.params.id}:`, error);
    return res.status(500).json({
      success: false,
      message: "Error al crear perfil de cliente",
      error: error.message
    });
  }
}

// Controlador para actualizar solo datos de cliente
export async function updateMedioPerfil(req, res) {
  try {
    const { id } = req.params;
    const { clienteData } = req.body;
    
    if (!clienteData) {
      return res.status(400).json({
        success: false,
        message: "Se requieren datos de cliente para actualizar perfil"
      });
    }
    
    const resultado = await clienteService.updateMedioPerfil(parseInt(id), clienteData);
    
    return res.status(resultado.success ? 200 : 400).json(resultado);
  } catch (error) {
    console.error(`Error al actualizar medio perfil para usuario ${req.params.id}:`, error);
    return res.status(500).json({
      success: false,
      message: "Error al actualizar perfil de cliente",
      error: error.message
    });
  }
}

// Controlador para actualizar datos completos (usuario + cliente)
export async function updatePerfilFull(req, res) {
  try {
    const { id } = req.params;
    const { userData, clienteData } = req.body;
    
    if (!userData && !clienteData) {
      return res.status(400).json({
        success: false,
        message: "Se requieren datos de usuario o cliente para actualizar"
      });
    }
    
    const resultado = await clienteService.updatePerfilFull(
      parseInt(id),
      userData || {}, 
      clienteData || {}
    );
    
    return res.status(resultado.success ? 200 : 400).json(resultado);
  } catch (error) {
    console.error(`Error al actualizar perfil completo para usuario ${req.params.id}:`, error);
    return res.status(500).json({
      success: false,
      message: "Error al actualizar perfil completo",
      error: error.message
    });
  }
}


export async function blockUserCliente(req, res) {
  try {
    const { id } = req.params;
    const { motivo } = req.body;
    
    const resultado = await clienteService.blockUserCliente(parseInt(id), motivo || "");
    
    if (!resultado.success) {
      return res.status(400).json(resultado);
    }
    
    return res.status(200).json(resultado);
  } catch (error) {
    console.error(`Error al bloquear usuario cliente ${req.params.id}:`, error);
    return res.status(500).json({
      success: false,
      message: "Error al bloquear usuario cliente",
      error: error.message
    });
  }
}


export async function deleteUserCliente(req, res) {
  try {
    const { id } = req.params;
    // Opcionalmente, obtener el parámetro de consulta para hard delete
    // Si no se especifica, por defecto es soft delete (true)
    const softDelete = req.query.softDelete !== 'false';
    
    const resultado = await clienteService.deleteUserCliente(parseInt(id), softDelete);
    
    if (!resultado.success) {
      return res.status(400).json(resultado);
    }
    
    return res.status(200).json(resultado);
  } catch (error) {
    console.error(`Error al eliminar usuario cliente ${req.params.id}:`, error);
    return res.status(500).json({
      success: false,
      message: "Error al eliminar usuario cliente",
      error: error.message
    });
  }
}