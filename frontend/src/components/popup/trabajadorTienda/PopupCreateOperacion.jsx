// frontend/src/components/trabajadorTienda/PopupCreateOperacion.jsx
import { useState } from 'react';
import Form from '@components/Form';
import '@styles/popup.css';
import CloseIcon from '@assets/XIcon.svg';
import QuestionIcon from '@assets/QuestionCircleIcon.svg';

export default function PopupCreateOperacion({ 
  show, 
  setShow, 
  clientes,
  productos,
  onSubmit 
}) {
  const [selectedProductos, setSelectedProductos] = useState([
    { id_producto: '', cantidad: 1, especificaciones: '' }
  ]);

  const handleAddProducto = () => {
    setSelectedProductos([
      ...selectedProductos, 
      { id_producto: '', cantidad: 1, especificaciones: '' }
    ]);
  };

  const handleRemoveProducto = (index) => {
    const newProductos = [...selectedProductos];
    newProductos.splice(index, 1);
    setSelectedProductos(newProductos);
  };

  const handleProductoChange = (index, field, value) => {
    const newProductos = [...selectedProductos];
    newProductos[index][field] = value;
    setSelectedProductos(newProductos);
  };

  const handleSubmit = async (formData) => {
    // Filter out empty products
    const validProductos = selectedProductos.filter(p => p.id_producto);
    
    const operacionData = {
      ...formData,
      productos: validProductos,
      estado_operacion: formData.estado_operacion || 'pendiente',
      cantidad_abono: parseFloat(formData.cantidad_abono) || 0
    };

    const success = await onSubmit(operacionData);
    if (success) {
      setShow(false);
      setSelectedProductos([{ id_producto: '', cantidad: 1, especificaciones: '' }]);
    }
  };

  if (!show) return null;

  return (
    <div className="bg">
      <div className="popup" style={{ 
        maxHeight: '90vh', 
        width: '700px',
        overflowY: 'auto',
        position: 'relative' 
      }}>
        <button 
          className='close' 
          onClick={() => setShow(false)}
        >
          <img src={CloseIcon} alt="Cerrar" />
        </button>

        <Form
          title="Crear Nueva Operación"
          fields={[
            {
              label: "Cliente",
              name: "id_cliente",
              fieldType: 'select',
              options: clientes?.map(cliente => ({ 
                value: cliente.id_cliente, 
                label: cliente.nombre_completo 
              })) || [],
              required: true,
            },
            {
              label: "Descripción",
              name: "descripcion_operacion",
              placeholder: 'Descripción detallada de la operación',
              fieldType: 'textarea',
              required: false,
              maxLength: 500,
            },
            {
              label: "Fecha Estimada de Entrega",
              name: "fecha_entrega_estimada",
              placeholder: 'YYYY-MM-DD',
              fieldType: 'input',
              type: "date",
              required: true,
            },
            {
              label: (
                <span>
                  Abono Inicial
                  <span className='tooltip-icon'>
                    <img src={QuestionIcon} alt="Ayuda" />
                    <span className='tooltip-text'>Monto inicial pagado por el cliente</span>
                  </span>
                </span>
              ),
              name: "cantidad_abono",
              placeholder: '0',
              fieldType: 'input',
              type: "number",
              required: false,
              min: 0,
            },
            {
              label: "Estado Inicial",
              name: "estado_operacion",
              fieldType: 'select',
              options: [
                { value: 'cotizacion', label: 'Cotización' },
                { value: 'orden_trabajo', label: 'Orden de Trabajo' },
                { value: 'pendiente', label: 'Pendiente' },
              ],
              required: false,
              defaultValue: 'pendiente'
            },
            // Productos custom field
            {
              label: "Productos",
              name: "productos_section",
              fieldType: 'custom',
              customRender: () => (
                <div className="space-y-4 mt-2">
                  {selectedProductos.map((producto, index) => (
                    <div key={index} className="p-4 border border-gray-200 rounded-lg bg-gray-50">
                      <div className="flex justify-between items-center mb-3">
                        <h4 className="font-semibold text-gray-700">Producto {index + 1}</h4>
                        {selectedProductos.length > 1 && (
                          <button 
                            type="button" 
                            onClick={() => handleRemoveProducto(index)}
                            className="text-red-600 text-sm hover:text-red-800"
                          >
                            Eliminar
                          </button>
                        )}
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                        <div>
                          <label className="text-sm font-medium text-gray-700 block mb-1">
                            Producto
                          </label>
                          <select 
                            value={producto.id_producto} 
                            onChange={(e) => handleProductoChange(index, 'id_producto', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md"
                            required
                          >
                            <option value="">Seleccionar producto</option>
                            {productos?.map(p => (
                              <option key={p.id_producto} value={p.id_producto}>
                                {p.nombre_producto}
                              </option>
                            ))}
                          </select>
                        </div>
                        
                        <div>
                          <label className="text-sm font-medium text-gray-700 block mb-1">
                            Cantidad
                          </label>
                          <input 
                            type="number" 
                            value={producto.cantidad} 
                            onChange={(e) => handleProductoChange(index, 'cantidad', parseInt(e.target.value))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md"
                            min="1"
                            required
                          />
                        </div>
                      </div>
                      
                      <div>
                        <label className="text-sm font-medium text-gray-700 block mb-1">
                          Especificaciones
                        </label>
                        <textarea 
                          value={producto.especificaciones || ''}
                          onChange={(e) => handleProductoChange(index, 'especificaciones', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md"
                          rows="2"
                          placeholder="Especificaciones especiales para este producto"
                        ></textarea>
                      </div>
                    </div>
                  ))}
                  
                  <button 
                    type="button"
                    onClick={handleAddProducto}
                    className="mt-3 w-full flex items-center justify-center px-4 py-2 bg-stone-600 hover:bg-stone-700 text-white rounded-md transition-colors"
                  >
                    + Añadir otro producto
                  </button>
                </div>
              )
            }
          ]}
          onSubmit={handleSubmit}
          buttonText="Crear Operación"
          backgroundColor={'#fff'}
        />
      </div>
    </div>
  );
}