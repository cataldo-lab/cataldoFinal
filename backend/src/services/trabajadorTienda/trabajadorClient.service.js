"use strict";
import Cliente from "../entity/personas/cliente.entity.js";
import { User } from "../../entity/personas/user.entity.js";
import { Producto } from "../entity/producto.entity.js";
import { Producto_Operacion } from "../entity/producto_operacion.entity.js";
import { Encuesta } from "../entity/encuesta.entity.js";
import { Operacion } from "../entity/operacion.entity.js";


/**
 * Trabajador consulta personas con Rol Cliente
 */
export const obtenerClientes = async (req, res) => {
  try {
    const clientes = await Cliente.findAll({
      include: [{
        model: User,
        attributes: ['id', 'nombre', 'email', 'telefono', 'estado']
      }],
      where: { activo: true } // Opcional: filtrar solo activos
    });

    return res.status(200).json({
      success: true,
      data: clientes
    });
  } catch (error) {
    console.error('Error al obtener clientes:', error);
    return res.status(500).json({
      success: false,
      message: 'Error al obtener clientes'
    });
  }
};

/**
 * Trabajador consulta un cliente específico
 */
export const obtenerClientePorId = async (req, res) => {
  try {
    const { id } = req.params;
    
    const cliente = await Cliente.findByPk(id, {
      include: [{
        model: User,
        attributes: ['id', 'nombre', 'email', 'telefono', 'estado']
      }]
    });

    if (!cliente) {
      return res.status(404).json({
        success: false,
        message: 'Cliente no encontrado'
      });
    }

    return res.status(200).json({
      success: true,
      data: cliente
    });
  } catch (error) {
    console.error('Error al obtener cliente:', error);
    return res.status(500).json({
      success: false,
      message: 'Error al obtener cliente'
    });
  }
};

/**
 * Trabajador crea personas con rol cliente
 */
export const crearCliente = async (req, res) => {
  try {
    const { 
      nombre, 
      email, 
      telefono, 
      rut, 
      direccion, 
      fecha_nacimiento,
      // Otros campos específicos de Cliente
    } = req.body;

    // Validaciones básicas
    if (!nombre || !email || !rut) {
      return res.status(400).json({
        success: false,
        message: 'Faltan campos requeridos: nombre, email, rut'
      });
    }

    // Verificar si el email o rut ya existen
    const clienteExistente = await Cliente.findOne({
      where: { 
        [Op.or]: [{ email }, { rut }]
      }
    });

    if (clienteExistente) {
      return res.status(409).json({
        success: false,
        message: 'Ya existe un cliente con ese email o RUT'
      });
    }

    // Crear el cliente
    const nuevoCliente = await Cliente.create({
      nombre,
      email,
      telefono,
      rut,
      direccion,
      fecha_nacimiento,
      rol: 'CLIENTE', // Asignar rol de cliente
      activo: true
    });

    return res.status(201).json({
      success: true,
      message: 'Cliente creado exitosamente',
      data: nuevoCliente
    });
  } catch (error) {
    console.error('Error al crear cliente:', error);
    return res.status(500).json({
      success: false,
      message: 'Error al crear cliente'
    });
  }
};

/**
 * Trabajador actualiza datos de cliente
 */
export const actualizarCliente = async (req, res) => {
  try {
    const { id } = req.params;
    const datosActualizar = req.body;

    // Buscar el cliente
    const cliente = await Cliente.findByPk(id);

    if (!cliente) {
      return res.status(404).json({
        success: false,
        message: 'Cliente no encontrado'
      });
    }

    // No permitir actualizar ciertos campos sensibles
    delete datosActualizar.id;
    delete datosActualizar.rol;

    // Actualizar el cliente
    await cliente.update(datosActualizar);

    return res.status(200).json({
      success: true,
      message: 'Cliente actualizado exitosamente',
      data: cliente
    });
  } catch (error) {
    console.error('Error al actualizar cliente:', error);
    return res.status(500).json({
      success: false,
      message: 'Error al actualizar cliente'
    });
  }
};

/**
 * Trabajador ingresa/registra encuesta de cliente
 */
export const registrarEncuestaCliente = async (req, res) => {
  try {
    const { clienteId, respuestas, operacionId } = req.body;

    // Validaciones
    if (!clienteId || !respuestas) {
      return res.status(400).json({
        success: false,
        message: 'Faltan datos requeridos'
      });
    }

    // Verificar que el cliente existe
    const cliente = await Cliente.findByPk(clienteId);
    if (!cliente) {
      return res.status(404).json({
        success: false,
        message: 'Cliente no encontrado'
      });
    }

    // Crear la encuesta
    const nuevaEncuesta = await Encuesta.create({
      clienteId,
      operacionId,
      respuestas,
      fecha_registro: new Date(),
      registrado_por: req.user?.id // ID del trabajador que registra
    });

    return res.status(201).json({
      success: true,
      message: 'Encuesta registrada exitosamente',
      data: nuevaEncuesta
    });
  } catch (error) {
    console.error('Error al registrar encuesta:', error);
    return res.status(500).json({
      success: false,
      message: 'Error al registrar encuesta'
    });
  }
};

/**
 * Trabajador puede ver todas las operaciones asociadas a un cliente
 */
export const obtenerOperacionesCliente = async (req, res) => {
  try {
    const { clienteId } = req.params;

    // Verificar que el cliente existe
    const cliente = await Cliente.findByPk(clienteId);
    if (!cliente) {
      return res.status(404).json({
        success: false,
        message: 'Cliente no encontrado'
      });
    }

    // Obtener todas las operaciones del cliente con sus detalles
    const operaciones = await Operacion.findAll({
      where: { clienteId },
      include: [
        {
          model: Producto_Operacion,
          include: [{ model: Producto }]
        },
        {
          model: Encuesta
        }
      ],
      order: [['fecha_operacion', 'DESC']]
    });

    return res.status(200).json({
      success: true,
      data: {
        cliente: {
          id: cliente.id,
          nombre: cliente.nombre,
          email: cliente.email
        },
        operaciones
      }
    });
  } catch (error) {
    console.error('Error al obtener operaciones del cliente:', error);
    return res.status(500).json({
      success: false,
      message: 'Error al obtener operaciones'
    });
  }
};

/**
 * Trabajador obtiene detalle de una operación específica
 */
export const obtenerDetalleOperacion = async (req, res) => {
  try {
    const { operacionId } = req.params;

    const operacion = await Operacion.findByPk(operacionId, {
      include: [
        {
          model: Cliente,
          include: [{ model: User }]
        },
        {
          model: Producto_Operacion,
          include: [{ model: Producto }]
        },
        {
          model: Encuesta
        }
      ]
    });

    if (!operacion) {
      return res.status(404).json({
        success: false,
        message: 'Operación no encontrada'
      });
    }

    return res.status(200).json({
      success: true,
      data: operacion
    });
  } catch (error) {
    console.error('Error al obtener detalle de operación:', error);
    return res.status(500).json({
      success: false,
      message: 'Error al obtener detalle de operación'
    });
  }
};

/**
 * Trabajador puede ver todas las encuestas
 */
export const obtenerEncuestas = async (req, res) => {
  try {
    const { clienteId, estado } = req.query;
    
    const whereClause = {};
    if (clienteId) whereClause.clienteId = clienteId;
    if (estado) whereClause.estado = estado;

    const encuestas = await Encuesta.findAll({
      where: whereClause,
      include: [
        {
          model: Cliente,
          attributes: ['id', 'nombre', 'email']
        },
        {
          model: Operacion,
          attributes: ['id', 'fecha_operacion', 'monto_total']
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    return res.status(200).json({
      success: true,
      data: encuestas
    });
  } catch (error) {
    console.error('Error al obtener encuestas:', error);
    return res.status(500).json({
      success: false,
      message: 'Error al obtener encuestas'
    });
  }
};

/**
 * Trabajador obtiene encuestas respondidas por un cliente específico
 */
export const obtenerEncuestasCliente = async (req, res) => {
  try {
    const { clienteId } = req.params;

    const encuestas = await Encuesta.findAll({
      where: { clienteId },
      include: [
        {
          model: Operacion,
          attributes: ['id', 'fecha_operacion']
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    return res.status(200).json({
      success: true,
      data: encuestas
    });
  } catch (error) {
    console.error('Error al obtener encuestas del cliente:', error);
    return res.status(500).json({
      success: false,
      message: 'Error al obtener encuestas'
    });
  }
};

/**
 * Trabajador elimina/desactiva un cliente (soft delete)
 */
export const desactivarCliente = async (req, res) => {
  try {
    const { id } = req.params;

    const cliente = await Cliente.findByPk(id);

    if (!cliente) {
      return res.status(404).json({
        success: false,
        message: 'Cliente no encontrado'
      });
    }

    // Soft delete
    await cliente.update({ activo: false });

    return res.status(200).json({
      success: true,
      message: 'Cliente desactivado exitosamente'
    });
  } catch (error) {
    console.error('Error al desactivar cliente:', error);
    return res.status(500).json({
      success: false,
      message: 'Error al desactivar cliente'
    });
  }
}; 