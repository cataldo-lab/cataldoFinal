import { useState } from 'react';
import {
  getAuditLogs,
  getUserActivity,
  getFailedLogins,
  getEntityHistory,
  getAuditDashboard
} from '@services/audit.service';

export const useAuditLogs = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchLogs = async (filtros = {}) => {
    setLoading(true);
    setError(null);
    try {
      const response = await getAuditLogs(filtros);
      if (response.status === 'Success') {
        setLogs(response.data);
      } else {
        setError(response.message);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return { logs, loading, error, fetchLogs };
};

export const useUserActivity = () => {
  const [activity, setActivity] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchActivity = async (userId) => {
    setLoading(true);
    setError(null);
    try {
      const response = await getUserActivity(userId);
      if (response.status === 'Success') {
        setActivity(response.data);
      } else {
        setError(response.message);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return { activity, loading, error, fetchActivity };
};

export const useFailedLogins = () => {
  const [failedLogins, setFailedLogins] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchFailedLogins = async (limit = 50) => {
    setLoading(true);
    setError(null);
    try {
      const response = await getFailedLogins(limit);
      if (response.status === 'Success') {
        setFailedLogins(response.data);
      } else {
        setError(response.message);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return { failedLogins, loading, error, fetchFailedLogins };
};

export const useEntityHistory = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchHistory = async (entidad, id) => {
    setLoading(true);
    setError(null);
    try {
      const response = await getEntityHistory(entidad, id);
      if (response.status === 'Success') {
        setHistory(response.data);
      } else {
        setError(response.message);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return { history, loading, error, fetchHistory };
};

export const useAuditDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchStats = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getAuditDashboard();
      if (response.status === 'Success') {
        setStats(response.data);
      } else {
        setError(response.message);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return { stats, loading, error, fetchStats };
};