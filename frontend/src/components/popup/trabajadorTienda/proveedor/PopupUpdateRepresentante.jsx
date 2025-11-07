// frontend/src/components/popup/PopUpEditarRepresentante.jsx
import { useState, useEffect } from 'react';
import { useRepresentantes } from '@hooks/prooveedores/useRepresentantes';
import { FaTimes, FaEdit, FaUserTie, FaSpinner } from 'react-icons/fa';

const PopUpEditarRepresentante = ({ isOpen, onClose, onSuccess, proveedorId }) => {
  const { 
    representantes, 
    loading: loadingReps, 
    fetchRepresentantes,
    updateRepresentante,
    loading: updating
  } = useRepresentantes();

  const [selectedRepresentante, setSelectedRepresentante] = useState(null);
  const [formData, setFormData] = useState({
    nombre_representante: '',
    apellido_representante: '',
    rut_representante: '',
    cargo_representante: '',
    fono_representante: '',
    correo_representante: ''
  });

  // Cargar representantes cuando se abre el modal
  useEffect(() => {
    if (isOpen && proveedorId) {
      fetchRepresentantes(proveedorId);
    }
  }, [isOpen, proveedorId]);

  // Cuando se selecciona un representante, llenar el formulario
  useEffect(() => {
    if (selectedRepresentante) {
      setFormData({
        nombre_representante: selectedRepresentante.nombre_representante || '',
        apellido_representante: selectedRepresentante.apellido_representante || '',
        rut_representante: selectedRepresentante.rut_representante || '',
        cargo_representante: selectedRepresentante.cargo_representante || '',
        fono_representante: selectedRepresentante.fono_representante || '',
        correo_representante: selectedRepresentante.correo_representante || ''
      });
    }
  }, [selectedRepresentante]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSelectRepresentante = (representante) => {
    setSelectedRepresentante(representante);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedRepresentante) {
      alert('❌ Debes seleccionar un representante');
      return;
    }

    const resultado = await updateRepresentante(
      selectedRepresentante.id_representante,
      formData
    );

    if (resultado) {
      onSuccess();
    }
  };

  const handleCancel = () => {
    setSelectedRepresentante(null);
    setFormData({
      nombre_representante: '',
      apellido_representante: '',
      rut_representante: '',
      cargo_representante: '',
      fono_representante: '',
      correo_representante: ''
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      className="bg popup-layer-2"
      style={{
        background: 'rgba(0, 0, 0, 0.6)',
        backdropFilter: 'blur(4px)'
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-white rounded-xl shadow-xl max-w-3xl w-full max-h-[90vh] overflow-hidden">
        
        {/* Header */}
        <div className="relative px-6 pt-6 pb-4 border-b border-stone-200">
          <div className="flex items-center space-x-2">
            <FaEdit className="w-6 h-6 text-stone-600" />
            <h2 className="text-xl font-semibold text-stone-800">
              Editar Representante
            </h2>
          </div>
          <button
            className="absolute top-4 right-4 p-2 hover:bg-stone-100 rounded-lg transition-colors"
            onClick={onClose}
          >
            <FaTimes className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-80px)]">
          {loadingReps ? (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="relative">
                <div className="w-16 h-16 border-4 border-stone-200 rounded-full"></div>
                <div className="w-16 h-16 border-4 border-stone-600 rounded-full animate-spin absolute top-0 border-t-transparent"></div>
              </div>
              <p className="mt-4 text-stone-600">Cargando representantes...</p>
            </div>
          ) : representantes.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20">
              <FaUserTie className="text-6xl mb-4 text-stone-300" />
              <p className="text-stone-600">Este proveedor no tiene representantes</p>
            </div>
          ) : (
            <div className="p-6 space-y-6">
              {/* Lista de Representantes */}
              <div className="bg-stone-50 rounded-lg p-5">
                <h3 className="font-semibold text-stone-800 mb-4 flex items-center gap-2">
                  <FaUserTie className="w-5 h-5 text-stone-600" />
                  Selecciona un Representante
                </h3>
                <div className="space-y-2">
                  {representantes.map((rep) => (
                    <button
                      key={rep.id_representante}
                      type="button"
                      onClick={() => handleSelectRepresentante(rep)}
                      className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                        selectedRepresentante?.id_representante === rep.id_representante
                          ? 'border-stone-600 bg-stone-100'
                          : 'border-stone-200 hover:border-stone-400 bg-white'
                      }`}
                    >
                      <div className="font-semibold text-stone-800">
                        {rep.nombre_representante} {rep.apellido_representante}
                      </div>
                      <div className="text-sm text-stone-600">
                        {rep.cargo_representante} • {rep.rut_representante}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Formulario de Edición */}
              {selectedRepresentante && (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="bg-stone-50 rounded-lg p-5">
                    <h3 className="font-semibold text-stone-800 mb-4">
                      Datos del Representante
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Nombre */}
                      <div>
                        <label htmlFor="nombre_representante" className="block text-sm font-medium text-stone-700 mb-1">
                          Nombre *
                        </label>
                        <input
                          type="text"
                          id="nombre_representante"
                          name="nombre_representante"
                          value={formData.nombre_representante}
                          onChange={handleChange}
                          className="w-full px-4 py-2.5 border border-stone-300 rounded-lg focus:ring-2 focus:ring-stone-500 focus:border-transparent transition-all"
                          required
                        />
                      </div>

                      {/* Apellido */}
                      <div>
                        <label htmlFor="apellido_representante" className="block text-sm font-medium text-stone-700 mb-1">
                          Apellido *
                        </label>
                        <input
                          type="text"
                          id="apellido_representante"
                          name="apellido_representante"
                          value={formData.apellido_representante}
                          onChange={handleChange}
                          className="w-full px-4 py-2.5 border border-stone-300 rounded-lg focus:ring-2 focus:ring-stone-500 focus:border-transparent transition-all"
                          required
                        />
                      </div>

                      {/* RUT */}
                      <div>
                        <label htmlFor="rut_representante" className="block text-sm font-medium text-stone-700 mb-1">
                          RUT *
                        </label>
                        <input
                          type="text"
                          id="rut_representante"
                          name="rut_representante"
                          value={formData.rut_representante}
                          onChange={handleChange}
                          className="w-full px-4 py-2.5 border border-stone-300 rounded-lg focus:ring-2 focus:ring-stone-500 focus:border-transparent transition-all"
                          placeholder="12.345.678-9"
                          required
                        />
                      </div>

                      {/* Cargo */}
                      <div>
                        <label htmlFor="cargo_representante" className="block text-sm font-medium text-stone-700 mb-1">
                          Cargo *
                        </label>
                        <input
                          type="text"
                          id="cargo_representante"
                          name="cargo_representante"
                          value={formData.cargo_representante}
                          onChange={handleChange}
                          className="w-full px-4 py-2.5 border border-stone-300 rounded-lg focus:ring-2 focus:ring-stone-500 focus:border-transparent transition-all"
                          required
                        />
                      </div>

                      {/* Teléfono */}
                      <div>
                        <label htmlFor="fono_representante" className="block text-sm font-medium text-stone-700 mb-1">
                          Teléfono
                        </label>
                        <input
                          type="tel"
                          id="fono_representante"
                          name="fono_representante"
                          value={formData.fono_representante}
                          onChange={handleChange}
                          className="w-full px-4 py-2.5 border border-stone-300 rounded-lg focus:ring-2 focus:ring-stone-500 focus:border-transparent transition-all"
                          placeholder="+56 9 1234 5678"
                        />
                      </div>

                      {/* Email */}
                      <div>
                        <label htmlFor="correo_representante" className="block text-sm font-medium text-stone-700 mb-1">
                          Email
                        </label>
                        <input
                          type="email"
                          id="correo_representante"
                          name="correo_representante"
                          value={formData.correo_representante}
                          onChange={handleChange}
                          className="w-full px-4 py-2.5 border border-stone-300 rounded-lg focus:ring-2 focus:ring-stone-500 focus:border-transparent transition-all"
                          placeholder="ejemplo@correo.com"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex justify-end space-x-3 pt-4 border-t border-stone-200">
                    <button
                      type="button"
                      onClick={handleCancel}
                      className="px-6 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-700 font-medium rounded-lg transition-colors"
                      disabled={updating}
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className={`px-6 py-2.5 bg-stone-600 hover:bg-stone-700 text-white font-medium rounded-lg transition-all flex items-center space-x-2 ${
                        updating ? 'opacity-50 cursor-not-allowed' : ''
                      }`}
                      disabled={updating}
                    >
                      {updating ? (
                        <>
                          <FaSpinner className="animate-spin h-4 w-4" />
                          <span>Guardando...</span>
                        </>
                      ) : (
                        <>
                          <FaEdit className="w-4 h-4" />
                          <span>Guardar Cambios</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PopUpEditarRepresentante;