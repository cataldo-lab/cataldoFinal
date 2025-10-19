// frontend/src/components/trabajadorTienda/PopupCreateProducto.jsx
import { useState, useEffect } from 'react';
import Form from '@components/Form';
import '@styles/popup.css';
import CloseIcon from '@assets/XIcon.svg';
import QuestionIcon from '@assets/QuestionCircleIcon.svg';

export default function PopupCreateProducto({ 
  show, 
  setShow, 
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

  // Calcular precio de venta automáticamente
  useEffect(() => {
    const costoTotal = Object.values(costos).reduce((sum, costo) => sum + costo, 0);
    const precioCalculado = costoTotal * (1 + margenGanancia / 100);
    setPrecioVentaCalculado(precioCalculado);
  }, [costos, margenGanancia]);

  const handleCostoChange = (nombre, valor) => {
    setCostos(prev => ({
      ...prev,
      [nombre]: parseFloat(valor) || 0
    }));
  };

  const handleMargenChange = (valor) => {
    setMargenGanancia(parseFloat(valor) || 0);
  };

  const handleSubmit = async (formData) => {
    const productoData = {
      ...formData,
      costo_fabricacion: costos.costo_fabricacion,
      costo_barnizador: costos.costo_barnizador,
      costo_vidrio: costos.costo_vidrio,
      costo_tela: costos.costo_tela,
      costo_materiales_otros: costos.costo_materiales_otros,
      precio_venta: precioVentaCalculado,
      margen_ganancia: margenGanancia,
      servicio: esServicio,
      oferta: formData.oferta === 'true' || false,
      activo: true
    };

    const success = await onSubmit(productoData);
    if (success) {
      setShow(false);
      setEsServicio(false);
      // Resetear los valores
      setCostos({
        costo_fabricacion: 0,
        costo_barnizador: 0,
        costo_vidrio: 0,
        costo_tela: 0,
        costo_materiales_otros: 0
      });
      setMargenGanancia(30);
    }
  };

  if (!show) return null;

  const costoTotal = Object.values(costos).reduce((sum, costo) => sum + costo, 0);

  return (
    <div className="bg">
      <div className="popup" style={{ 
        height: '750px', 
        maxWidth: '90vw', 
        overflowY: 'auto',
        position: 'relative' 
      }}>
        <button 
          className='close' 
          onClick={() => setShow(false)}
          style={{
            position: 'absolute',
            top: '15px',
            right: '15px',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '5px',
            zIndex: 10
          }}
        >
          <img src={CloseIcon} alt="Cerrar" style={{ width: '24px', height: '24px' }} />
        </button>

        <Form
          title="Crear Nuevo Producto"
          fields={[
            {
              label: "Nombre del Producto",
              name: "nombre_producto",
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
            },
            {
              label: "Descripción",
              name: "descripcion_producto",
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
              defaultValue: 'false',
              onChange: (e) => setEsServicio(e.target.value === 'true')
            },
            {
              label: "Costo de Fabricación",
              name: "costo_fabricacion",
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
              placeholder: '0',
              fieldType: 'input',
              type: "number",
              required: false,
              min: 0,
              onChange: (e) => handleCostoChange('costo_materiales_otros', e.target.value)
            },
            {
              label: (
                <div style={{ 
                  marginBottom: '10px', 
                  padding: '10px', 
                  backgroundColor: '#f5f5f5', 
                  borderRadius: '5px',
                  fontWeight: 'bold'
                }}>
                  💰 Costo Total: ${costoTotal.toFixed(2)}
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
              placeholder: '30',
              fieldType: 'input',
              type: "number",
              required: false,
              min: 0,
              max: 100,
              defaultValue: '30',
              onChange: (e) => handleMargenChange(e.target.value)
            },
            {
              label: (
                <div style={{ 
                  marginTop: '10px', 
                  padding: '15px', 
                  backgroundColor: '#e8f5e9', 
                  borderRadius: '5px',
                  fontSize: '1.1em',
                  fontWeight: 'bold',
                  color: '#2e7d32'
                }}>
                  💵 Precio de Venta Calculado: ${precioVentaCalculado.toFixed(2)}
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
              defaultValue: 'false'
            }
          ]}
          onSubmit={handleSubmit}
          buttonText="Crear Producto"
          backgroundColor={'#fff'}
        />
      </div>
    </div>
  );
}