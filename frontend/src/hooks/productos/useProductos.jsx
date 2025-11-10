// frontend/src/hooks/productos/useProductos.jsx
import { useState, useEffect } from 'react';
import {
  getProductos,
  createProducto,
  updateProducto,
  deleteProducto,
  getCategorias
} from '@services/producto.service.js';
import { showErrorAlert, showSuccessAlert, deleteDataAlert } from '@helpers/sweetAlert.js';

export const useProductos = () => {
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtros, setFiltros] = useState({
    categoria: '',
    activo: true,
    busqueda: ''
  });

  // Cargar productos
  const fetchProductos = async () => {
    setLoading(true);
    try {
      const response = await getProductos({
        categoria: filtros.categoria || undefined,
        activo: filtros.activo
      });

      if (response.status === 'Success') {
        setProductos(response.data);
      } else {
        showErrorAlert('Error', 'No se pudieron cargar los productos');
      }
    } catch (error) {
      showErrorAlert('Error', 'Error al cargar productos');
    } finally {
      setLoading(false);
    }
  };

  // Cargar categorías
  const fetchCategorias = async () => {
    try {
      const response = await getCategorias();
      if (response.status === 'Success') {
        setCategorias(response.data);
      }
    } catch (error) {
      console.error('Error al cargar categorías:', error);
    }
  };

  // Crear producto
  const handleCreateProducto = async (productoData) => {
    try {
      const response = await createProducto(productoData);
      if (response.status === 'Success') {
        showSuccessAlert('Éxito', 'Producto creado correctamente');
        await fetchProductos();
        return true;
      } else {
        showErrorAlert('Error', response.message || 'Error al crear producto');
        return false;
      }
    } catch (error) {
      showErrorAlert('Error', 'Error al crear producto');
      return false;
    }
  };

  // Actualizar producto
  const handleUpdateProducto = async (id, productoData) => {
    try {
      const response = await updateProducto(id, productoData);
      if (response.status === 'Success') {
        showSuccessAlert('Éxito', 'Producto actualizado correctamente');
        await fetchProductos();
        return true;
      } else {
        showErrorAlert('Error', response.message || 'Error al actualizar');
        return false;
      }
    } catch (error) {
      showErrorAlert('Error', 'Error al actualizar producto');
      return false;
    }
  };

  // Eliminar producto
  const handleDeleteProducto = async (id) => {
    try {
      const result = await deleteDataAlert();
      if (!result.isConfirmed) {
        return false;
      }

      const response = await deleteProducto(id);
      if (response.status === 'Success') {
        showSuccessAlert('Éxito', 'Producto eliminado correctamente');
        await fetchProductos();
        return true;
      } else {
        showErrorAlert('Error', response.message || 'Error al eliminar producto');
        return false;
      }
    } catch (error) {
      showErrorAlert('Error', 'Error al eliminar producto');
      return false;
    }
  };

  // Cambiar filtros
  const handleFiltroChange = (campo, valor) => {
    setFiltros(prev => ({ ...prev, [campo]: valor }));
  };

  // Limpiar filtros
  const limpiarFiltros = () => {
    setFiltros({ categoria: '', activo: true, busqueda: '' });
  };

  // Productos filtrados por búsqueda
  const productosFiltrados = productos.filter(p =>
    p.nombre_producto.toLowerCase().includes(filtros.busqueda.toLowerCase())
  );

  // Cargar datos al montar
  useEffect(() => {
    fetchProductos();
    fetchCategorias();
  }, [filtros.categoria, filtros.activo]);

  return {
    productos: productosFiltrados,
    categorias,
    loading,
    filtros,
    handleFiltroChange,
    limpiarFiltros,
    handleCreateProducto,
    handleUpdateProducto,
    handleDeleteProducto,
    fetchProductos
  };
};

// Hook helper para formatear precios
export const useFormatPrecio = () => {
  const formatPrecio = (precio) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      minimumFractionDigits: 0
    }).format(precio);
  };

  return { formatPrecio };
};