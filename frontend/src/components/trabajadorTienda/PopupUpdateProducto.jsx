// frontend/src/components/trabajadorTienda/PopupUpdateProducto.jsx
import { useState, useEffect } from 'react';
import Form from '@components/Form';
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
  const [costos, setCostos] = useState({
    costo_fabricacion: 0,
    costo_barnizador: 0,
    costo_vidrio: 0,
    costo_tela: 0,
    costo_materiales_otros: 0
  });
  const [margenGanancia, setMargenGanancia] = useState(30);
  const [precioVentaCalculado, setPrecioVentaCalculado] = useState(0);

  // Inicializar valores cuando cambia el producto
  useEffect(() => {
    if (producto) {
      setEsServicio(producto.servicio || false);
      const nuevosCostos = {
        costo_fabricacion: parseInt(producto.costo_fabricacion) || 0,
        costo_barnizador: parseInt(producto.costo_barnizador) || 0,
        costo_vidrio: parseInt(producto.costo_vidrio) || 0,
        costo_tela: parseInt(producto.costo_tela) || 0,
        costo_materiales_otros: parseInt(producto.costo_materiales_otros) || 0
      };
      setCostos(nuevosCostos);
      setMargenGanancia(parseFloat(producto.margen_ganancia) || 30);
    }
  }, [producto]);

  // Calcular precio de venta automáticamente
  useEffect(() => {
    const costoTotal = Object.values(costos).reduce((sum, costo) => sum + costo, 0);
    const precioCalculado = costoTotal * (1 + margenGanancia / 100);
    setPrecioVentaCalculado(precioCalculado);
  }, [costos, margenGanancia]);

  const handleCostoChange = (nombre, valor) => {
    setCostos(prev => ({
      ...prev,
      [nombre]: parseInt(valor) || 0
    }));
  };

  const handleMargenChange = (valor) => {
    setMargenGanancia(parseFloat(valor) || 0);
  };

  const handleSubmit = async (formData) => {
    const productoData = {
      ...formData,
      costo_fabricacion: parseInt(costos.costo_fabricacion),
      costo_barnizador: parseInt(costos.costo_barnizador),
      costo_vidrio: parseInt(costos.costo_vidrio),
      costo_tela: parseInt(costos.costo_tela),
      costo_materiales_otros: parseInt(costos.costo_materiales_otros),
      precio_venta: Math.round(precioVentaCalculado),
      margen_ganancia: margenGanancia,
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

  const costoTotal = Object.values(costos).reduce((sum, costo) => sum + costo, 0);

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
              onChange: (e) => handleCostoChange('costo_fabricacion', e.target.value)
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
              onChange: (e) => handleCostoChange('costo_barnizador', e.target.value)
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
              onChange: (e) => handleCostoChange('costo_vidrio', e.target.value)
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
              onChange: (e) => handleCostoChange('costo_tela', e.target.value)
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
              onChange: (e) => handleCostoChange('costo_materiales_otros', e.target.value)
            },
            {
              label: (
                <div style={{ marginBottom: '10px' }}>
                  <strong>Costo Total: ${costoTotal.toLocaleString('es-CL')}</strong>
                </div>
              ),
              name: "costo_total_display",
              fieldType: 'custom',
              customRender: () => null
            },
            {
              label: (
                <span>
                  Margen de Ganancia (%)
                  <span className='tooltip-icon'>
                    <img src={QuestionIcon} alt="Ayuda" />
                    <span className='tooltip-text'>Porcentaje de ganancia sobre el costo total</span>
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
              onChange: (e) => handleMargenChange(e.target.value)
            },
            {
              label: (
                <div style={{ marginTop: '10px', padding: '10px', backgroundColor: '#e8f5e9', borderRadius: '5px' }}>
                  <strong>Precio de Venta Calculado: ${Math.round(precioVentaCalculado).toLocaleString('es-CL')}</strong>
                </div>
              ),
              name: "precio_venta_display",
              fieldType: 'custom',
              customRender: () => null
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