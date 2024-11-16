// frontend/src/hooks/useDataFetching.js
import { useState, useEffect, useCallback, useRef } from 'react';
import { getMockStatus, getConfigs } from '../api/mockoonApi';
import { instancesStore } from '../stores/instancesStore';

export const createEventEmitter = () => {
  const listeners = new Set();
  
  return {
    emit: () => {
      listeners.forEach(listener => listener());
    },
    subscribe: (listener) => {
      listeners.add(listener);
      return () => listeners.delete(listener);
    }
  };
};

export const syncEmitter = createEventEmitter();

export const useInstanceStatus = (interval = 5000) => {
  const [instances, setInstances] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const prevInstancesRef = useRef(instances);

  const mergeInstances = (newInstances) => {
    const merged = newInstances.map(instance => {
      const prevInstance = prevInstancesRef.current.find(
        prev => prev.port === instance.port
      );
      return {
        ...instance,
        _fadeIn: !prevInstance
      };
    });

    // Add optimistic instance if it exists
    const optimisticInstance = instancesStore.getOptimisticInstance();
    if (optimisticInstance) {
      // Check if the optimistic instance is now in the real data
      const isReal = merged.some(instance => instance.port === optimisticInstance.port);
      if (!isReal) {
        merged.push(optimisticInstance);
      } else {
        // If it's now real, remove it from optimistic store
        instancesStore.removeOptimisticInstance();
      }
    }

    prevInstancesRef.current = merged;
    return merged;
  };

  const fetchInstances = useCallback(async (isInitial = false) => {
    try {
      if (isInitial) {
        setLoading(true);
      }

      const statusData = await getMockStatus();
      
      if (isInitial) {
        setInstances(mergeInstances(statusData));
      } else {
        setInstances(prev => {
          const newInstances = mergeInstances(statusData);
          // Check if the instance list has changed (excluding optimistic)
          const prevReal = prev.filter(p => !p._optimistic);
          const hasChanged = JSON.stringify(prevReal.map(p => p.port)) !== 
                            JSON.stringify(statusData.map(p => p.port));
          if (hasChanged) {
            syncEmitter.emit();
          }
          return newInstances;
        });
      }
      
      setError(null);
    } catch (error) {
      setError(error.message);
      console.error('Error fetching instances:', error);
    } finally {
      if (isInitial) {
        setLoading(false);
      }
    }
  }, []);

  // Subscribe to optimistic updates
  useEffect(() => {
    const unsubscribe = instancesStore.subscribe(() => {
      fetchInstances(false);
    });
    return unsubscribe;
  }, [fetchInstances]);

  useEffect(() => {
    fetchInstances(true);
    const timer = setInterval(() => fetchInstances(false), interval);
    return () => clearInterval(timer);
  }, [fetchInstances, interval]);

  return { instances, loading, error, refetch: fetchInstances };
};

export const useConfigurations = () => {
  const [configs, setConfigs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchConfigs = useCallback(async (isInitial = false) => {
    try {
      if (isInitial) {
        setLoading(true);
      }

      const configsData = await getConfigs();
      setConfigs(configsData);
      setError(null);
    } catch (error) {
      setError(error.message);
      console.error('Error fetching configs:', error);
    } finally {
      if (isInitial) {
        setLoading(false);
      }
    }
  }, []);

  // Subscribe to instance changes
  useEffect(() => {
    const unsubscribe = syncEmitter.subscribe(() => {
      fetchConfigs(false);
    });
    return unsubscribe;
  }, [fetchConfigs]);

  useEffect(() => {
    fetchConfigs(true);
  }, [fetchConfigs]);

  return { configs, loading, error, refetch: fetchConfigs };
};