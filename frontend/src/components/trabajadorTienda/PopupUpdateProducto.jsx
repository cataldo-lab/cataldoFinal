// frontend/src/components/trabajadorTienda/PopupUpdateProducto.jsx
import { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
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
  const { control, handleSubmit, watch, reset, formState: { errors } } = useForm({
    defaultValues: {
      nombre_producto: '',
      categoria_producto: '',
      descripcion_producto: '',
      tipo_producto: 'false',
      costo_fabricacion: 0,
      costo_barnizador: 0,
      costo_vidrio: 0,
      costo_tela: 0,
      costo_materiales_otros: 0,
      margen_ganancia: 30,
      oferta: 'false',
      activo: 'true'
    }
  });

  const [esServicio, setEsServicio] = useState(false);
  const [precioVentaCalculado, setPrecioVentaCalculado] = useState(0);

  // Inicializar valores cuando cambia el producto
  useEffect(() => {
    if (producto) {
      reset({
        nombre_producto: producto.nombre_producto || '',
        categoria_producto: producto.categoria_producto || '',
        descripcion_producto: producto.descripcion_producto || '',
        tipo_producto: producto.servicio ? 'true' : 'false',
        costo_fabricacion: parseInt(producto.costo_fabricacion) || 0,
        costo_barnizador: parseInt(producto.costo_barnizador) || 0,
        costo_vidrio: parseInt(producto.costo_vidrio) || 0,
        costo_tela: parseInt(producto.costo_tela) || 0,
        costo_materiales_otros: parseInt(producto.costo_materiales_otros) || 0,
        margen_ganancia: parseInt(producto.margen_ganancia) || 30,
        oferta: producto.oferta ? 'true' : 'false',
        activo: producto.activo ? 'true' : 'false'
      });
      setEsServicio(producto.servicio || false);
    }
  }, [producto, reset]);

  // Observar los valores de los costos
  const costos = {
    costo_fabricacion: watch('costo_fabricacion') || 0,
    costo_barnizador: watch('costo_barnizador') || 0,
    costo_vidrio: watch('costo_vidrio') || 0,
    costo_tela: watch('costo_tela') || 0,
    costo_materiales_otros: watch('costo_materiales_otros') || 0
  };

  const margenGanancia = watch('margen_ganancia') || 30;
  const tipoProducto = watch('tipo_producto');

  // Calcular precio de venta automáticamente
  useEffect(() => {
    const costoTotal = Object.values(costos).reduce((sum, costo) => sum + parseInt(costo || 0), 0);
    const precioCalculado = costoTotal * (1 + margenGanancia / 100);
    setPrecioVentaCalculado(precioCalculado);
  }, [costos, margenGanancia]);

  // Actualizar estado de servicio
  useEffect(() => {
    setEsServicio(tipoProducto === 'true');
  }, [tipoProducto]);

  const handleFormSubmit = async (formData) => {
    const productoData = {
      ...formData,
      costo_fabricacion: parseInt(formData.costo_fabricacion) || 0,
      costo_barnizador: parseInt(formData.costo_barnizador) || 0,
      costo_vidrio: parseInt(formData.costo_vidrio) || 0,
      costo_tela: parseInt(formData.costo_tela) || 0,
      costo_materiales_otros: parseInt(formData.costo_materiales_otros) || 0,
      precio_venta: precioVentaCalculado,
      margen_ganancia: parseInt(formData.margen_ganancia) || 30,
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

  const costoTotal = Object.values(costos).reduce((sum, costo) => sum + parseInt(costo || 0), 0);

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

        <form onSubmit={handleSubmit(handleFormSubmit)}>
          <div style={{ padding: '20px' }}>
            <h2 style={{ marginBottom: '20px', fontSize: '1.5em', fontWeight: 'bold' }}>
              Editar Producto
            </h2>

            {/* Nombre del Producto */}
            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>
                Nombre del Producto *
              </label>
              <Controller
                name="nombre_producto"
                control={control}
                rules={{ 
                  required: 'El nombre es requerido',
                  minLength: { value: 3, message: 'Mínimo 3 caracteres' },
                  maxLength: { value: 100, message: 'Máximo 100 caracteres' }
                }}
                render={({ field }) => (
                  <input
                    {...field}
                    type="text"
                    placeholder="Mesa de comedor 6 personas"
                    style={{
                      width: '100%',
                      padding: '10px',
                      border: `1px solid ${errors.nombre_producto ? '#ef4444' : '#ddd'}`,
                      borderRadius: '5px',
                      fontSize: '1em',
                      boxSizing: 'border-box'
                    }}
                  />
                )}
              />
              {errors.nombre_producto && (
                <span style={{ color: '#ef4444', fontSize: '0.85em' }}>
                  {errors.nombre_producto.message}
                </span>
              )}
            </div>

            {/* Categoría */}
            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>
                Categoría *
              </label>
              <Controller
                name="categoria_producto"
                control={control}
                rules={{ required: 'La categoría es requerida' }}
                render={({ field }) => (
                  <select
                    {...field}
                    style={{
                      width: '100%',
                      padding: '10px',
                      border: `1px solid ${errors.categoria_producto ? '#ef4444' : '#ddd'}`,
                      borderRadius: '5px',
                      fontSize: '1em',
                      boxSizing: 'border-box'
                    }}
                  >
                    <option value="">Seleccionar categoría</option>
                    {categorias.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                )}
              />
              {errors.categoria_producto && (
                <span style={{ color: '#ef4444', fontSize: '0.85em' }}>
                  {errors.categoria_producto.message}
                </span>
              )}
            </div>

            {/* Descripción */}
            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>
                Descripción
              </label>
              <Controller
                name="descripcion_producto"
                control={control}
                rules={{ maxLength: { value: 500, message: 'Máximo 500 caracteres' } }}
                render={({ field }) => (
                  <textarea
                    {...field}
                    placeholder="Descripción detallada del producto"
                    style={{
                      width: '100%',
                      padding: '10px',
                      border: `1px solid ${errors.descripcion_producto ? '#ef4444' : '#ddd'}`,
                      borderRadius: '5px',
                      fontSize: '1em',
                      minHeight: '80px',
                      fontFamily: 'inherit',
                      boxSizing: 'border-box'
                    }}
                  />
                )}
              />
              {errors.descripcion_producto && (
                <span style={{ color: '#ef4444', fontSize: '0.85em' }}>
                  {errors.descripcion_producto.message}
                </span>
              )}
            </div>

            {/* Tipo de Producto */}
            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>
                ¿Es un servicio? *
              </label>
              <Controller
                name="tipo_producto"
                control={control}
                rules={{ required: 'Este campo es requerido' }}
                render={({ field }) => (
                  <select
                    {...field}
                    style={{
                      width: '100%',
                      padding: '10px',
                      border: '1px solid #ddd',
                      borderRadius: '5px',
                      fontSize: '1em',
                      boxSizing: 'border-box'
                    }}
                  >
                    <option value="false">No - Es un producto físico</option>
                    <option value="true">Sí - Es un servicio</option>
                  </select>
                )}
              />
            </div>

            {/* Costos */}
            <div style={{ marginBottom: '15px', padding: '10px', backgroundColor: '#f9f9f9', borderRadius: '5px' }}>
              <h3 style={{ marginBottom: '10px', fontWeight: 'bold' }}>Costos</h3>
              
              {[
                { name: 'costo_fabricacion', label: 'Costo de Fabricación' },
                { name: 'costo_barnizador', label: 'Costo Barnizado' },
                { name: 'costo_vidrio', label: 'Costo Vidrio' },
                { name: 'costo_tela', label: 'Costo Tela' },
                { name: 'costo_materiales_otros', label: 'Otros Costos' }
              ].map(({ name, label }) => (
                <div key={name} style={{ marginBottom: '10px' }}>
                  <label style={{ display: 'block', marginBottom: '3px', fontSize: '0.9em', fontWeight: '500' }}>
                    {label}
                  </label>
                  <Controller
                    name={name}
                    control={control}
                    rules={{ 
                      min: { value: 0, message: 'No puede ser negativo' }
                    }}
                    render={({ field }) => (
                      <input
                        {...field}
                        type="number"
                        placeholder="0"
                        style={{
                          width: '100%',
                          padding: '8px',
                          border: `1px solid ${errors[name] ? '#ef4444' : '#ddd'}`,
                          borderRadius: '5px',
                          fontSize: '0.95em',
                          boxSizing: 'border-box'
                        }}
                      />
                    )}
                  />
                  {errors[name] && (
                    <span style={{ color: '#ef4444', fontSize: '0.8em' }}>
                      {errors[name].message}
                    </span>
                  )}
                </div>
              ))}

              <div style={{ 
                marginTop: '10px', 
                padding: '10px', 
                backgroundColor: '#e8f5e9', 
                borderRadius: '5px',
                fontWeight: 'bold',
                color: '#2e7d32'
              }}>
                💰 Costo Total: ${costoTotal.toFixed(2)}
              </div>
            </div>

            {/* Margen de Ganancia */}
            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>
                Margen de Ganancia (%)
                <span className='tooltip-icon' style={{ marginLeft: '5px', cursor: 'help' }}>
                  <img src={QuestionIcon} alt="Ayuda" style={{ width: '16px', height: '16px' }} />
                  <span className='tooltip-text'>Porcentaje de ganancia sobre el costo total</span>
                </span>
              </label>
              <Controller
                name="margen_ganancia"
                control={control}
                rules={{ 
                  min: { value: 0, message: 'No puede ser negativo' },
                  max: { value: 100, message: 'Máximo 100%' }
                }}
                render={({ field }) => (
                  <input
                    {...field}
                    type="number"
                    placeholder="30"
                    style={{
                      width: '100%',
                      padding: '10px',
                      border: `1px solid ${errors.margen_ganancia ? '#ef4444' : '#ddd'}`,
                      borderRadius: '5px',
                      fontSize: '1em',
                      boxSizing: 'border-box'
                    }}
                  />
                )}
              />
              {errors.margen_ganancia && (
                <span style={{ color: '#ef4444', fontSize: '0.85em' }}>
                  {errors.margen_ganancia.message}
                </span>
              )}
            </div>

            {/* Precio de Venta Calculado */}
            <div style={{ 
              marginBottom: '15px',
              padding: '15px', 
              backgroundColor: '#e8f5e9', 
              borderRadius: '5px',
              fontSize: '1.1em',
              fontWeight: 'bold',
              color: '#2e7d32'
            }}>
              💵 Precio de Venta Calculado: ${precioVentaCalculado.toFixed(2)}
            </div>

            {/* ¿Producto en Oferta? */}
            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>
                ¿Producto en Oferta?
              </label>
              <Controller
                name="oferta"
                control={control}
                render={({ field }) => (
                  <select
                    {...field}
                    style={{
                      width: '100%',
                      padding: '10px',
                      border: '1px solid #ddd',
                      borderRadius: '5px',
                      fontSize: '1em',
                      boxSizing: 'border-box'
                    }}
                  >
                    <option value="false">No</option>
                    <option value="true">Sí</option>
                  </select>
                )}
              />
            </div>

            {/* Estado */}
            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>
                Estado *
              </label>
              <Controller
                name="activo"
                control={control}
                rules={{ required: 'El estado es requerido' }}
                render={({ field }) => (
                  <select
                    {...field}
                    style={{
                      width: '100%',
                      padding: '10px',
                      border: `1px solid ${errors.activo ? '#ef4444' : '#ddd'}`,
                      borderRadius: '5px',
                      fontSize: '1em',
                      boxSizing: 'border-box'
                    }}
                  >
                    <option value="true">Activo</option>
                    <option value="false">Inactivo</option>
                  </select>
                )}
              />
              {errors.activo && (
                <span style={{ color: '#ef4444', fontSize: '0.85em' }}>
                  {errors.activo.message}
                </span>
              )}
            </div>

            {/* Botón Submit */}
            <button 
              type="submit"
              style={{
                width: '100%',
                padding: '12px',
                backgroundColor: '#57534e',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                fontSize: '1em',
                fontWeight: 'bold',
                cursor: 'pointer',
                transition: 'background-color 0.3s'
              }}
              onMouseEnter={(e) => e.target.style.backgroundColor = '##44403c'}
              onMouseLeave={(e) => e.target.style.backgroundColor = '#57534e'}
            >
              Actualizar Producto
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}