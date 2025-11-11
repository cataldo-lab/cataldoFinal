// frontend/src/pages/trabajador-tienda/Encuesta.jsx
import { useState, useEffect } from 'react';
import {
  FaStar,
  FaRegStar,
  FaClipboardList,
  FaSync,
  FaChartBar,
  FaCommentDots,
  FaTruck,
  FaBoxOpen,
  FaCheckCircle,
  FaTimesCircle,
  FaCalendarAlt
} from 'react-icons/fa';
import {
  crearEncuesta,
  getEncuestas,
  getOperacionesSinEncuesta,
  getEstadisticasEncuestas
} from '../../services/encuesta.service.js';
import { showSuccessAlert, showErrorAlert } from '../../helpers/sweetAlert.js';

const Encuesta = () => {
  const [operacionesSinEncuesta, setOperacionesSinEncuesta] = useState([]);
  const [encuestas, setEncuestas] = useState([]);
  const [estadisticas, setEstadisticas] = useState(null);
  const [loading, setLoading] = useState(true);
  const [vistaActual, setVistaActual] = useState('crear'); // 'crear', 'lista', 'estadisticas'

  // Estados del formulario
  const [operacionSeleccionada, setOperacionSeleccionada] = useState('');
  const [notaPedido, setNotaPedido] = useState(4);
  const [notaRepartidor, setNotaRepartidor] = useState(4);
  const [comentario, setComentario] = useState('');
  const [enviando, setEnviando] = useState(false);

  useEffect(() => {
    cargarDatos();
  }, [vistaActual]);

  const cargarDatos = async () => {
    setLoading(true);
    try {
      if (vistaActual === 'crear') {
        const response = await getOperacionesSinEncuesta();
        if (response.success) {
          setOperacionesSinEncuesta(response.data || []);
        }
      } else if (vistaActual === 'lista') {
        const response = await getEncuestas({ page: 1, limit: 50 });
        if (response.success) {
          setEncuestas(response.data?.encuestas || []);
        }
      } else if (vistaActual === 'estadisticas') {
        const response = await getEstadisticasEncuestas();
        if (response.success) {
          setEstadisticas(response.data);
        }
      }
    } catch (error) {
      console.error('Error al cargar datos:', error);
      showErrorAlert('Error', 'No se pudieron cargar los datos');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!operacionSeleccionada) {
      showErrorAlert('Error', 'Debes seleccionar una operación');
      return;
    }

    setEnviando(true);
    try {
      const response = await crearEncuesta({
        id_operacion: parseInt(operacionSeleccionada),
        nota_pedido: notaPedido,
        nota_repartidor: notaRepartidor,
        comentario: comentario.trim() || null
      });

      if (response.success) {
        showSuccessAlert('¡Éxito!', 'Encuesta creada correctamente');
        // Resetear formulario
        setOperacionSeleccionada('');
        setNotaPedido(4);
        setNotaRepartidor(4);
        setComentario('');
        // Recargar operaciones
        cargarDatos();
      } else {
        showErrorAlert('Error', response.message || 'No se pudo crear la encuesta');
      }
    } catch (error) {
      console.error('Error al crear encuesta:', error);
      showErrorAlert('Error', error.message || 'Error al crear la encuesta');
    } finally {
      setEnviando(false);
    }
  };

  const renderStars = (rating, setRating, disabled = false) => {
    return (
      <div className="flex gap-2">
        {[1, 2, 3, 4, 5, 6, 7].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => !disabled && setRating(star)}
            disabled={disabled}
            className={`text-3xl transition-all transform hover:scale-110 ${
              star <= rating ? 'text-yellow-400' : 'text-gray-300'
            } ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'}`}
          >
            {star <= rating ? <FaStar /> : <FaRegStar />}
          </button>
        ))}
      </div>
    );
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('es-CL', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="text-center">
          <FaSync className="inline-block animate-spin h-12 w-12 text-stone-600 mb-4" />
          <p className="text-xl text-gray-600 font-medium">Cargando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto pt-20">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-stone-700 mb-2 flex items-center gap-3">
            <FaClipboardList className="text-4xl" />
            Gestión de Encuestas
          </h1>
          <p className="text-gray-600">Administra las encuestas de satisfacción de clientes</p>
        </div>

        {/* Tabs de navegación */}
        <div className="flex gap-2 mb-6 flex-wrap">
          <button
            onClick={() => setVistaActual('crear')}
            className={`px-6 py-3 rounded-xl font-semibold transition-all flex items-center gap-2 ${
              vistaActual === 'crear'
                ? 'bg-stone-600 text-white shadow-lg'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            <FaClipboardList /> Crear Encuesta
          </button>
          <button
            onClick={() => setVistaActual('lista')}
            className={`px-6 py-3 rounded-xl font-semibold transition-all flex items-center gap-2 ${
              vistaActual === 'lista'
                ? 'bg-stone-600 text-white shadow-lg'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            <FaCommentDots /> Ver Encuestas
          </button>
          <button
            onClick={() => setVistaActual('estadisticas')}
            className={`px-6 py-3 rounded-xl font-semibold transition-all flex items-center gap-2 ${
              vistaActual === 'estadisticas'
                ? 'bg-stone-600 text-white shadow-lg'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            <FaChartBar /> Estadísticas
          </button>
        </div>

        {/* Vista de Crear Encuesta */}
        {vistaActual === 'crear' && (
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-2xl font-bold text-stone-800 mb-6 flex items-center gap-2">
              <FaClipboardList className="text-stone-600" />
              Nueva Encuesta de Satisfacción
            </h2>

            {operacionesSinEncuesta.length === 0 ? (
              <div className="text-center py-12">
                <FaCheckCircle className="text-6xl text-green-500 mx-auto mb-4" />
                <p className="text-xl text-gray-600 font-semibold">
                  ¡Excelente! No hay operaciones pendientes de encuesta
                </p>
                <p className="text-gray-500 mt-2">
                  Todas las operaciones entregadas tienen su encuesta registrada
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Selector de Operación */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Seleccionar Operación
                  </label>
                  <select
                    value={operacionSeleccionada}
                    onChange={(e) => setOperacionSeleccionada(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-stone-500 focus:ring-2 focus:ring-stone-200 focus:outline-none"
                    required
                  >
                    <option value="">-- Seleccione una operación --</option>
                    {operacionesSinEncuesta.map((op) => (
                      <option key={op.id_operacion} value={op.id_operacion}>
                        #{op.id_operacion} - {op.cliente?.nombreCompleto || 'Sin cliente'} -{' '}
                        {op.descripcion_operacion || 'Sin descripción'}
                      </option>
                    ))}
                  </select>
                  <p className="text-sm text-gray-500 mt-1">
                    Hay {operacionesSinEncuesta.length} operación(es) sin encuesta
                  </p>
                </div>

                {/* Nota del Pedido */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    <FaBoxOpen className="inline mr-2" />
                    Calificación del Pedido (1-7)
                  </label>
                  {renderStars(notaPedido, setNotaPedido)}
                  <p className="text-sm text-gray-600 mt-2">
                    Calificación actual: <span className="font-bold text-stone-600">{notaPedido}/7</span>
                  </p>
                </div>

                {/* Nota del Repartidor */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    <FaTruck className="inline mr-2" />
                    Calificación del Repartidor (1-7)
                  </label>
                  {renderStars(notaRepartidor, setNotaRepartidor)}
                  <p className="text-sm text-gray-600 mt-2">
                    Calificación actual: <span className="font-bold text-stone-600">{notaRepartidor}/7</span>
                  </p>
                </div>

                {/* Comentario */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    <FaCommentDots className="inline mr-2" />
                    Comentario (opcional)
                  </label>
                  <textarea
                    value={comentario}
                    onChange={(e) => setComentario(e.target.value)}
                    placeholder="Escribe aquí cualquier comentario adicional..."
                    maxLength={255}
                    rows={4}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-stone-500 focus:ring-2 focus:ring-stone-200 focus:outline-none resize-none"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {comentario.length}/255 caracteres
                  </p>
                </div>

                {/* Botón de envío */}
                <button
                  type="submit"
                  disabled={enviando}
                  className="w-full bg-gradient-to-r from-stone-600 to-stone-700 hover:from-stone-700 hover:to-stone-800 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
                >
                  {enviando ? (
                    <>
                      <FaSync className="animate-spin" />
                      Enviando...
                    </>
                  ) : (
                    <>
                      <FaCheckCircle />
                      Enviar Encuesta
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        )}

        {/* Vista de Lista de Encuestas */}
        {vistaActual === 'lista' && (
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-2xl font-bold text-stone-800 mb-6 flex items-center gap-2">
              <FaCommentDots className="text-stone-600" />
              Listado de Encuestas
            </h2>

            {encuestas.length === 0 ? (
              <div className="text-center py-12">
                <FaTimesCircle className="text-6xl text-gray-300 mx-auto mb-4" />
                <p className="text-xl text-gray-600">No hay encuestas registradas</p>
              </div>
            ) : (
              <div className="space-y-4">
                {encuestas.map((encuesta) => (
                  <div
                    key={encuesta.id_encuesta}
                    className="border-2 border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all"
                  >
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
                      <div>
                        <h3 className="text-lg font-bold text-stone-800">
                          Operación #{encuesta.operacion?.id_operacion}
                        </h3>
                        <p className="text-sm text-gray-600">
                          Cliente: {encuesta.operacion?.cliente?.nombreCompleto || 'Sin cliente'}
                        </p>
                        <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                          <FaCalendarAlt />
                          {formatDate(encuesta.fecha_encuesta)}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <p className="text-sm font-semibold text-gray-700 mb-2">
                          <FaBoxOpen className="inline mr-1" /> Pedido:
                        </p>
                        <div className="flex gap-1">
                          {renderStars(encuesta.nota_pedido, () => {}, true)}
                        </div>
                        <p className="text-sm text-gray-600 mt-1">
                          {encuesta.nota_pedido}/7
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-700 mb-2">
                          <FaTruck className="inline mr-1" /> Repartidor:
                        </p>
                        <div className="flex gap-1">
                          {renderStars(encuesta.nota_repartidor, () => {}, true)}
                        </div>
                        <p className="text-sm text-gray-600 mt-1">
                          {encuesta.nota_repartidor}/7
                        </p>
                      </div>
                    </div>

                    {encuesta.comentario && (
                      <div className="bg-gray-50 rounded-lg p-4 border-l-4 border-stone-500">
                        <p className="text-sm font-semibold text-gray-700 mb-1">
                          <FaCommentDots className="inline mr-1" /> Comentario:
                        </p>
                        <p className="text-sm text-gray-600">{encuesta.comentario}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Vista de Estadísticas */}
        {vistaActual === 'estadisticas' && estadisticas && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <h2 className="text-2xl font-bold text-stone-800 mb-6 flex items-center gap-2">
                <FaChartBar className="text-stone-600" />
                Estadísticas Generales
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-xl p-6">
                  <p className="text-sm opacity-90 mb-2">Total Encuestas</p>
                  <p className="text-4xl font-bold">{estadisticas.total}</p>
                </div>

                <div className="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-xl p-6">
                  <p className="text-sm opacity-90 mb-2">Promedio Pedido</p>
                  <p className="text-4xl font-bold">{estadisticas.promedio_pedido}/7</p>
                </div>

                <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-xl p-6">
                  <p className="text-sm opacity-90 mb-2">Promedio Repartidor</p>
                  <p className="text-4xl font-bold">{estadisticas.promedio_repartidor}/7</p>
                </div>

                <div className="bg-gradient-to-br from-orange-500 to-orange-600 text-white rounded-xl p-6">
                  <p className="text-sm opacity-90 mb-2">Con Comentarios</p>
                  <p className="text-4xl font-bold">{estadisticas.con_comentarios}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Encuesta;
