// frontend/src/services/proveedor.service.js
import axios from './root.service.js';

// ========================================
// SERVICIOS DE PROVEEDORES
// ========================================

/**
 * Obtener todos los proveedores
 * @param {Object} filtros - Filtros opcionales
 * @param {string} [filtros.rol_proveedor] - Filtrar por rol
 * @param {string} [filtros.search] - Búsqueda general
 * @returns {Promise<Object>} Respuesta del servidor
 */
export async function getProveedores() {
  try {
    const response = await axios.get('/proveedores');
    return response.data;
  } catch (error) {
    console.error('Error al cargar proveedores:', error);
    
    // En lugar de devolver el error, devolvemos un objeto con estado de error
    // pero con un array vacío de datos para que la aplicación pueda continuar
    return { 
      status: 'Error', 
      message: error.response?.data?.message || 'Error al obtener proveedores',
      details: error.message,
      data: [] 
    };
  }
}

/**
 * Obtener un proveedor por ID con toda su información
 * Incluye: materiales, representantes, estadísticas y últimas compras
 * @param {number} id - ID del proveedor
 * @returns {Promise<Object>} Respuesta del servidor
 */
export async function getProveedorById(id) {
    try {
        const response = await axios.get(`/proveedores/${id}`);
        return response.data;
    } catch (error) {
        return error.response?.data || { 
            status: 'Error', 
            message: 'Error de conexión' 
        };
    }
}

/**
 * Crear un nuevo proveedor
 * @param {Object} proveedorData - Datos del proveedor
 * @param {string} proveedorData.rol_proveedor - Rol/tipo de proveedor
 * @param {string} proveedorData.rut_proveedor - RUT del proveedor
 * @param {string} proveedorData.nombre_representante - Nombre del representante principal
 * @param {string} proveedorData.apellido_representante - Apellido del representante
 * @param {string} proveedorData.rut_representante - RUT del representante
 * @param {string} proveedorData.fono_proveedor - Teléfono
 * @param {string} proveedorData.correo_proveedor - Email
 * @returns {Promise<Object>} Respuesta del servidor
 */
export async function createProveedor(proveedorData) {
    try {
        const response = await axios.post('/proveedores', proveedorData);
        return response.data;
    } catch (error) {
        return error.response?.data || { 
            status: 'Error', 
            message: 'Error de conexión' 
        };
    }
}

/**
 * Actualizar un proveedor existente
 * @param {number} id - ID del proveedor
 * @param {Object} proveedorData - Datos a actualizar
 * @returns {Promise<Object>} Respuesta del servidor
 */
export async function updateProveedor(id, proveedorData) {
    try {
        const response = await axios.put(`/proveedores/${id}`, proveedorData);
        return response.data;
    } catch (error) {
        return error.response?.data || { 
            status: 'Error', 
            message: 'Error de conexión' 
        };
    }
}

/**
 * Eliminar un proveedor
 * Solo se puede eliminar si no tiene materiales asociados
 * @param {number} id - ID del proveedor
 * @returns {Promise<Object>} Respuesta del servidor
 */
export async function deleteProveedor(id) {
    try {
        const response = await axios.delete(`/proveedores/${id}`);
        return response.data;
    } catch (error) {
        return error.response?.data || { 
            status: 'Error', 
            message: 'Error de conexión' 
        };
    }
}

// ========================================
// SERVICIOS DE REPRESENTANTES
// ========================================

/**
 * Obtener representantes de un proveedor
 * @param {number} id_proveedor - ID del proveedor
 * @returns {Promise<Object>} Respuesta del servidor
 */
export async function getRepresentantesByProveedor(id_proveedor) {
    try {
        const response = await axios.get(`/proveedores/${id_proveedor}/representantes`);
        return response.data;
    } catch (error) {
        return error.response?.data || { 
            status: 'Error', 
            message: 'Error de conexión' 
        };
    }
}

/**
 * Crear un nuevo representante para un proveedor
 * @param {number} id_proveedor - ID del proveedor
 * @param {Object} representanteData - Datos del representante
 * @param {string} representanteData.nombre_representante - Nombre
 * @param {string} representanteData.apellido_representante - Apellido
 * @param {string} representanteData.rut_representante - RUT
 * @param {string} representanteData.cargo_representante - Cargo
 * @param {string} [representanteData.fono_representante] - Teléfono
 * @param {string} [representanteData.correo_representante] - Email
 * @returns {Promise<Object>} Respuesta del servidor
 */
export async function createRepresentante(id_proveedor, representanteData) {
    try {
        const response = await axios.post(
            `/proveedores/${id_proveedor}/representantes`, 
            representanteData
        );
        return response.data;
    } catch (error) {
        return error.response?.data || { 
            status: 'Error', 
            message: 'Error de conexión' 
        };
    }
}

/**
 * Actualizar un representante existente
 * @param {number} id_representante - ID del representante
 * @param {Object} representanteData - Datos a actualizar
 * @returns {Promise<Object>} Respuesta del servidor
 */
export async function updateRepresentante(id_representante, representanteData) {
    try {
        const response = await axios.put(
            `/proveedores/representantes/${id_representante}`, 
            representanteData
        );
        return response.data;
    } catch (error) {
        return error.response?.data || { 
            status: 'Error', 
            message: 'Error de conexión' 
        };
    }
}

/**
 * Eliminar un representante
 * @param {number} id_representante - ID del representante
 * @returns {Promise<Object>} Respuesta del servidor
 */
export async function deleteRepresentante(id_representante) {
    try {
        const response = await axios.delete(
            `/proveedores/representantes/${id_representante}`
        );
        return response.data;
    } catch (error) {
        return error.response?.data || { 
            status: 'Error', 
            message: 'Error de conexión' 
        };
    }
}

// ========================================
// SERVICIOS DE ANÁLISIS
// ========================================

/**
 * Obtener análisis completo de un proveedor
 * Incluye materiales suministrados y estadísticas de compras
 * Nota: Este endpoint está en /materiales/proveedores/:id/analisis
 * @param {number} id_proveedor - ID del proveedor
 * @returns {Promise<Object>} Respuesta del servidor
 */
export async function getAnalisisProveedor(id_proveedor) {
    try {
        const response = await axios.get(`/materiales/proveedores/${id_proveedor}/analisis`);
        return response.data;
    } catch (error) {
        return error.response?.data || { 
            status: 'Error', 
            message: 'Error de conexión' 
        };
    }
}