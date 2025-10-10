// src/pages/AuditLogs.jsx
import { useEffect, useState } from 'react';
import { useAuditLogs } from '@hooks/users/useAudit';

const AuditLogs = () => {
  const [limit, setLimit] = useState(10);
  const [showLoginLogs, setShowLoginLogs] = useState(false);
  const { logs, loading, error, fetchLogs } = useAuditLogs();

  useEffect(() => {
    fetchLogs({ limit });
  }, [limit]);

  const handleLimitChange = (e) => {
    setLimit(Number(e.target.value));
  };

  // Filtrar logs que no sean "Inicio de sesión exitoso" si showLoginLogs es false
  const filteredLogs = showLoginLogs 
    ? logs 
    : logs.filter(log => log.descripcion !== "Inicio de sesión exitoso");

  if (loading) return <div>Cargando logs...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 pt-30">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Logs de Auditoría</h1>
        
        <div className="flex items-center space-x-4">
          {/* Checkbox para mostrar/ocultar logs de inicio de sesión */}
          <div className="flex items-center">
            <input
              type="checkbox"
              id="showLoginLogs"
              checked={showLoginLogs}
              onChange={() => setShowLoginLogs(!showLoginLogs)}
              className="mr-2"
            />
            <label htmlFor="showLoginLogs" className="text-sm text-gray-600">
              Incluir inicios de sesión
            </label>
          </div>

          {/* Selector de límite */}
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">Mostrar:</span>
            <select
              className="px-2 py-1 border rounded"
              value={limit}
              onChange={handleLimitChange}
            >
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
              <option value={500}>500</option>
              <option value={900}>900</option>
            </select>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto shadow-md rounded-lg">
        <table className="min-w-full bg-white">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipo</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Usuario</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Descripción</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredLogs.map(log => (
              <tr key={log.id_log} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(log.fecha_hora).toLocaleString()}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{log.tipo_evento}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{log.email_usuario}</td>
                <td className="px-6 py-4 text-sm text-gray-500">{log.descripcion}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {/* Contador de registros */}
      <div className="mt-2 text-sm text-gray-500">
        Mostrando {filteredLogs.length} de {logs.length} registros
      </div>
    </div>
  );
}

export default AuditLogs;