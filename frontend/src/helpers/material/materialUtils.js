// frontend/src/helpers/materialUtils.js
   export const getEstadoStockBadge = (estadoStock) => {
     const colores = {
       critico: 'bg-red-100 text-red-800',
       bajo: 'bg-orange-100 text-orange-800',
       medio: 'bg-yellow-100 text-yellow-800',
       normal: 'bg-green-100 text-green-800'
     };
   
     const iconos = {
       critico: '🔴',
       bajo: '🟠',
       medio: '🟡',
       normal: '🟢'
     };
   
     return {
       className: `px-2 py-1 rounded-full text-xs font-medium ${colores[estadoStock.nivel]}`,
       icon: iconos[estadoStock.nivel],
       mensaje: estadoStock.mensaje
     };
   };
   
   export const getStockClassName = (existencia, stockMinimo) => {
     if (existencia === 0) return 'text-red-600';
     if (existencia <= stockMinimo) return 'text-orange-600';
     return 'text-green-600';
   };
   
   export const filtrarMaterialesCriticos = (materiales) => {
     return materiales.filter(m => 
       m.existencia_material === 0 || 
       m.existencia_material <= m.stock_minimo
     );
   };