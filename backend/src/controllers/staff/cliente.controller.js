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
  updatePerfilFull,
  deleteUserCliente,
  searchClientes  
} from "../../services/staff/cliente.service.js";

// Controlador para obtener todos los clientes
export async function getAllClientesController(req, res) {
  try {
    // Obtener parámetros de paginación desde query
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    
    const resultado = await getAllClientes(page, limit);
    
    return res.status(200).json({
      success: true,
      message: "Clientes obtenidos exitosamente",
      data: resultado
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
export async function getClienteByIdController(req, res) {
  try {
    const { id } = req.params;
    const cliente = await getClienteById(parseInt(id));
    
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

// Controlador para buscar clientes con filtros
export async function searchClientesController(req, res) {
  try {
    const { nombre, categoria, email } = req.query;
    
    const filtros = {};
    
    // Filtro por nombre (búsqueda parcial case-insensitive)
    if (nombre) {
      filtros.nombre = nombre;
    }
    
    // Filtro por email (búsqueda parcial case-insensitive)
    if (email) {
      filtros.email = email;
    }
    
    // Filtro por categoría (regular, vip, premium)
    if (categoria) {
      // Validar que la categoría sea válida
      const categoriasValidas = ['regular', 'vip', 'premium'];
      if (categoriasValidas.includes(categoria.toLowerCase())) {
        filtros.categoria = categoria.toLowerCase();
      } else {
        return res.status(400).json({
          success: false,
          message: `Categoría inválida. Valores permitidos: ${categoriasValidas.join(', ')}`
        });
      }
    }
    
    const clientes = await searchClientes(filtros);
    
    return res.status(200).json({
      success: true,
      message: "Búsqueda de clientes realizada exitosamente",
      data: clientes,
      total: clientes.length,
      filtros: filtros
    });
  } catch (error) {
    console.error("Error al buscar clientes:", error);
    return res.status(500).json({
      success: false,
      message: "Error al buscar clientes",
      error: error.message
    });
  }
}

// Controlador para obtener datos básicos de usuario (parte 1 del perfil)
export async function getUserByIdController(req, res) {
  try {
    const { id } = req.params;
    const usuario = await getUserById(parseInt(id));
    
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
export async function getClienteDetalleByIdController(req, res) {
  try {
    const { id } = req.params;
    const resultado = await getClienteDetalleById(parseInt(id));
    
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
export async function createPerfilFullController(req, res) {
  try {
    const { userData, clienteData } = req.body;
    
    if (!userData || !clienteData) {
      return res.status(400).json({
        success: false,
        message: "Se requieren datos de usuario y cliente para crear perfil completo"
      });
    }
    
    const resultado = await createPerfilFull(userData, clienteData);
    
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
export async function createMedioPerfilController(req, res) {
  try {
    const { id } = req.params;
    const { clienteData } = req.body;
    
    if (!clienteData) {
      return res.status(400).json({
        success: false,
        message: "Se requieren datos de cliente para crear perfil"
      });
    }
    
    const resultado = await createMedioPerfil(parseInt(id), clienteData);
    
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
export async function updateMedioPerfilController(req, res) {
  try {
    const { id } = req.params;
    const { clienteData } = req.body;
    
    if (!clienteData) {
      return res.status(400).json({
        success: false,
        message: "Se requieren datos de cliente para actualizar perfil"
      });
    }
    
    const resultado = await updateMedioPerfil(parseInt(id), clienteData);
    
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
export async function updatePerfilFullController(req, res) {
  try {
    const { id } = req.params;
    const { userData, clienteData } = req.body;
    
    if (!userData && !clienteData) {
      return res.status(400).json({
        success: false,
        message: "Se requieren datos de usuario o cliente para actualizar"
      });
    }
    
    const resultado = await updatePerfilFull(
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

// Controlador para bloquear usuario cliente
export async function blockUserClienteController(req, res) {
  try {
    const { id } = req.params;
    const { motivo } = req.body;
    
    const resultado = await blockUserCliente(parseInt(id), motivo || "");
    
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

// Controlador para eliminar usuario cliente
export async function deleteUserClienteController(req, res) {
  try {
    const { id } = req.params;
    const softDelete = req.query.softDelete !== 'false';
    
    const resultado = await deleteUserCliente(parseInt(id), softDelete);
    
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