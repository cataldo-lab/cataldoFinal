// frontend/src/components/trabajadorTienda/PopupUpdateProducto.jsx
import { useState, useEffect } from 'react';
import Form from '@components/Form';  // Use the alias path instead of relative path
import '@styles/popup.css';
import CloseIcon from '@assets/XIcon.svg';
import QuestionIcon from '@assets/QuestionCircleIcon.svg';

export default function PopupUpdateProducto({ 
  show, 
  setShow, 
  producto, 
  categorias,
  onSubmit 
}) {
  const [esServicio, setEsServicio] = useState(false);

  useEffect(() => {
    if (producto) {
      setEsServicio(producto.servicio || false);
    }
  }, [producto]);

  const handleSubmit = async (formData) => {
    const productoData = {
      ...formData,
      costo_fabricacion: parseFloat(formData.costo_fabricacion) || 0,
      costo_barnizador: parseFloat(formData.costo_barnizador) || 0,
      costo_vidrio: parseFloat(formData.costo_vidrio) || 0,
      costo_tela: parseFloat(formData.costo_tela) || 0,
      costo_materiales_otros: parseFloat(formData.costo_materiales_otros) || 0,
      precio_venta: parseFloat(formData.precio_venta),
      margen_ganancia: parseFloat(formData.margen_ganancia) || 30,
      servicio: esServicio,
      oferta: formData.oferta === 'true',
      activo: formData.activo === 'true'
    };

    const success = await onSubmit(producto.id_producto, productoData);
    if (success) {
      setShow(false);
    }
  };

  if (!show || !producto) return null;

  return (
    <div className="bg">
      <div className="popup" style={{ height: '750px', maxWidth: '90vw', overflowY: 'auto' }}>
        <button className='close' onClick={() => setShow(false)}>
          <img src={CloseIcon} alt="Cerrar" />
        </button>

        <Form
          title="Editar Producto"
          fields={[
            {
              label: "Nombre del Producto",
              name: "nombre_producto",
              defaultValue: producto.nombre_producto,
              placeholder: 'Mesa de comedor 6 personas',
              fieldType: 'input',
              type: "text",
              required: true,
              minLength: 3,
              maxLength: 100,
            },
            {
              label: "Categoría",
              name: "categoria_producto",
              fieldType: 'select',
              options: categorias.map(cat => ({ 
                value: cat, 
                label: cat 
              })),
              required: true,
              defaultValue: producto.categoria_producto
            },
            {
              label: "Descripción",
              name: "descripcion_producto",
              defaultValue: producto.descripcion_producto || '',
              placeholder: 'Descripción detallada del producto',
              fieldType: 'textarea',
              required: false,
              maxLength: 500,
            },
            {
              label: "¿Es un servicio?",
              name: "tipo_producto",
              fieldType: 'select',
              options: [
                { value: 'false', label: 'No - Es un producto físico' },
                { value: 'true', label: 'Sí - Es un servicio' }
              ],
              required: true,
              defaultValue: producto.servicio ? 'true' : 'false',
              onChange: (e) => setEsServicio(e.target.value === 'true')
            },
            {
              label: "Costo de Fabricación",
              name: "costo_fabricacion",
              defaultValue: producto.costo_fabricacion,
              placeholder: '0',
              fieldType: 'input',
              type: "number",
              required: true,
              min: 0,
            },
            {
              label: "Costo Barnizado",
              name: "costo_barnizador",
              defaultValue: producto.costo_barnizador,
              placeholder: '0',
              fieldType: 'input',
              type: "number",
              required: false,
              min: 0,
            },
            {
              label: "Costo Vidrio",
              name: "costo_vidrio",
              defaultValue: producto.costo_vidrio,
              placeholder: '0',
              fieldType: 'input',
              type: "number",
              required: false,
              min: 0,
            },
            {
              label: "Costo Tela",
              name: "costo_tela",
              defaultValue: producto.costo_tela,
              placeholder: '0',
              fieldType: 'input',
              type: "number",
              required: false,
              min: 0,
            },
            {
              label: "Otros Costos",
              name: "costo_materiales_otros",
              defaultValue: producto.costo_materiales_otros,
              placeholder: '0',
              fieldType: 'input',
              type: "number",
              required: false,
              min: 0,
            },
            {
              label: "Precio de Venta",
              name: "precio_venta",
              defaultValue: producto.precio_venta,
              placeholder: '0',
              fieldType: 'input',
              type: "number",
              required: true,
              min: 0,
            },
            {
              label: (
                <span>
                  Margen de Ganancia (%)
                  <span className='tooltip-icon'>
                    <img src={QuestionIcon} alt="Ayuda" />
                    <span className='tooltip-text'>Porcentaje de ganancia esperado</span>
                  </span>
                </span>
              ),
              name: "margen_ganancia",
              defaultValue: producto.margen_ganancia,
              placeholder: '30',
              fieldType: 'input',
              type: "number",
              required: false,
              min: 0,
              max: 100,
            },
            {
              label: "¿Producto en Oferta?",
              name: "oferta",
              fieldType: 'select',
              options: [
                { value: 'false', label: 'No' },
                { value: 'true', label: 'Sí' }
              ],
              required: false,
              defaultValue: producto.oferta ? 'true' : 'false'
            },
            {
              label: "Estado",
              name: "activo",
              fieldType: 'select',
              options: [
                { value: 'true', label: 'Activo' },
                { value: 'false', label: 'Inactivo' }
              ],
              required: true,
              defaultValue: producto.activo ? 'true' : 'false'
            }
          ]}
          onSubmit={handleSubmit}
          buttonText="Actualizar Producto"
          backgroundColor={'#fff'}
        />
      </div>
    </div>
  );
}