// frontend/src/services/proveedor.service.js
import axios from './root.service.js';

export async function getProveedoresConRepresentantes() {
    try {
        const { data } = await axios.get('/proveedores/con-representantes');
        return data;
    } catch (error) {
        console.error('Error al obtener proveedores con representantes:', error);
        return {
            success: false,
            message: error.response?.data?.message || 'Error al obtener proveedores'
        };
    }
}

export async function getProveedores() {
  try {
    const response = await axios.get('/proveedores');
    return response.data;
  } catch (error) {
    console.error('Error al cargar proveedores:', error);
    
    return { 
      status: 'Error', 
      message: error.response?.data?.message || 'Error al obtener proveedores',
      details: error.message,
      data: [] 
    };
  }
}

export async function createProveedorConRepresentante(data) {
    try {
        const response = await axios.post('/proveedores/con-representante', data);
        return response.data;
    } catch (error) {
        console.error('Error al crear proveedor con representante:', error);
        return {
            success: false,
            message: error.response?.data?.message || 'Error al crear proveedor'
        };
    }
}


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

