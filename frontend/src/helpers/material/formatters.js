// frontend/src/helpers/formatters.js
export const formatPrecio = (precio) => {
  if (precio === undefined || precio === null) {
    return '$0';
  }
  
  return new Intl.NumberFormat('es-CL', { 
    style: 'currency', 
    currency: 'CLP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(precio);
};

// Puedes agregar otras funciones de formato aquí
export const formatFecha = (fecha) => {
  if (!fecha) return '';
  
  return new Date(fecha).toLocaleDateString('es-CL', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
};

export const formatNumero = (numero, decimales = 0) => {
  if (numero === undefined || numero === null) {
    return '0';
  }
  
  return new Intl.NumberFormat('es-CL', {
    minimumFractionDigits: decimales,
    maximumFractionDigits: decimales
  }).format(numero);
};