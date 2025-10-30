// frontend/src/services/materiales.service.js
import axios from './root.service.js';


export async function getMateriales(incluirInactivos = false) {
  try {
    const params = incluirInactivos ? { incluirInactivos: true } : {};
    const { data } = await axios.get('/materiales', { params });
    return data;
  } catch (error) {
    console.error('Error al obtener materiales:', error);
    return {
      success: false,
      message: error.response?.data?.message || 'Error al obtener materiales'
    };
  }
}


export async function getMaterialById(id) {
  try {
    const { data } = await axios.get(`/materiales/${id}`);
    return data;
  } catch (error) {
    console.error('Error al obtener material:', error);
    return {
      success: false,
      message: error.response?.data?.message || 'Error al obtener material'
    };
  }
}


export async function getMaterialesConRepresentantes() {
  try {
    const { data } = await axios.get('/materiales/con-representantes');
    return data;
  } catch (error) {
    console.error('Error al obtener materiales con representantes:', error);
    return {
      success: false,
      message: error.response?.data?.message || 'Error al obtener materiales con representantes'
    };
  }
}


export async function getMaterialRepresentante(id) {
  try {
    const { data } = await axios.get(`/materiales/${id}/representante`);
    return data;
  } catch (error) {
    console.error('Error al obtener representante del material:', error);
    return {
      success: false,
      message: error.response?.data?.message || 'Error al obtener representante'
    };
  }
}


export async function createMaterial(materialData) {
  try {
    const { data } = await axios.post('/materiales', materialData);
    return data;
  } catch (error) {
    console.error('Error al crear material:', error);
    return {
      success: false,
      message: error.response?.data?.message || 'Error al crear material'
    };
  }
}


export async function updateMaterial(id, materialData) {
  try {
    console.log('🔧 Service - ID:', id, 'Tipo:', typeof id);
    console.log('🔧 Service - Datos:', materialData);
    
    const { data } = await axios.patch(`/materiales/${parseInt(id)}`, materialData);
    
    console.log('✅ Service - Respuesta:', data);
    return data;
  } catch (error) {
    console.error('❌ Service - Error completo:', error);
    console.error('❌ Service - Response:', error.response?.data);
    return {
      success: false,
      message: error.response?.data?.message || 'Error al actualizar material'
    };
  }
}


export async function deleteMaterial(id) {
  try {
    const { data } = await axios.delete(`/materiales/${id}`);
    return data;
  } catch (error) {
    console.error('Error al eliminar material:', error);
    return {
      success: false,
      message: error.response?.data?.message || 'Error al eliminar material'
    };
  }
}


export async function hardDeleteMaterial(id) {
  try {
    const { data } = await axios.delete(`/materiales/${id}/permanent`);
    return data;
  } catch (error) {
    console.error('Error al eliminar permanentemente material:', error);
    return {
      success: false,
      message: error.response?.data?.message || 'Error al eliminar permanentemente material'
    };
  }
}