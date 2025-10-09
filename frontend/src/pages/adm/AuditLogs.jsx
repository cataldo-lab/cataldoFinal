// src/pages/AuditLogs.jsx
import { useEffect } from 'react';
import { useAuditLogs } from '@hooks/users/useAudit';

const AuditLogs = () => {
  const { logs, loading, error, fetchLogs } = useAuditLogs();

  useEffect(() => {
    fetchLogs({ limit: 100 });
  }, []);

  if (loading) return <div>Cargando logs...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h1>Logs de Auditoría</h1>
      <table>
        <thead>
          <tr>
            <th>Fecha</th>
            <th>Tipo</th>
            <th>Usuario</th>
            <th>Descripción</th>
          </tr>
        </thead>
        <tbody>
          {logs.map(log => (
            <tr key={log.id_log}>
              <td>{new Date(log.fecha_hora).toLocaleString()}</td>
              <td>{log.tipo_evento}</td>
              <td>{log.email_usuario}</td>
              <td>{log.descripcion}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AuditLogs;