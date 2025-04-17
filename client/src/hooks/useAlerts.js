import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const useAlerts = (pollInterval = 10000) => {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAlerts = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await axios.get('/api/alerts', {
        params: {
          resolved: false,
          lastMinutes: 60
        }
      });
      setAlerts(data);
    } catch (err) {
      setError(err.message || 'Failed to fetch alerts');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAlerts();
    const interval = setInterval(fetchAlerts, pollInterval);
    return () => clearInterval(interval);
  }, [fetchAlerts, pollInterval]);

  const resolveAlert = async (alertId) => {
    try {
      await axios.patch(`/api/alerts/${alertId}/resolve`);
      setAlerts((prev) => prev.filter((alert) => alert._id !== alertId));
    } catch (err) {
      setError(err.message || 'Failed to resolve alert');
    }
  };

  return {
    alerts,
    loading,
    error,
    refresh: fetchAlerts,
    resolveAlert
  };
};

export default useAlerts;
