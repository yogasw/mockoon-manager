// frontend/src/hooks/useDataFetching.js
import {useCallback, useEffect, useRef, useState} from 'react';
import {getConfigs, getMockStatus} from '../api/mockoonApi';

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

export const stateChangeEmitter = createEventEmitter();

export const useInstanceStatus = (longPooling = false, interval = 5000) => {
    const [instances, setInstances] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const prevInstancesRef = useRef(instances);

    const fetchInstances = useCallback(async (isInitial = false) => {
        try {
            if (isInitial) {
                setLoading(true);
            }

            const statusData = await getMockStatus();

            const prevPorts = new Set(prevInstancesRef.current.map(i => i.port));
            const newPorts = new Set(statusData.map(i => i.port));
            const hasChanged = prevPorts.size !== newPorts.size ||
                [...prevPorts].some(port => !newPorts.has(port)) ||
                [...newPorts].some(port => !prevPorts.has(port));

            if (hasChanged) {
                setInstances(statusData);
                prevInstancesRef.current = statusData;
                stateChangeEmitter.emit();
            } else {
                setInstances(statusData);
            }

            setError(null);
        } catch (error) {
            setError(error);
            console.error('Error fetching instances:', error);
            if (error.response?.status === 401) {
                // Stop polling on auth error
                return false;
            }
        } finally {
            if (isInitial) {
                setLoading(false);
            }
        }
        return true; // Continue polling if no auth error
    }, []);

    useEffect(() => {
        if (longPooling) {
            const timer = setInterval(async () => {
                const shouldContinue = await fetchInstances(false);
                if (!shouldContinue) {
                    clearInterval(timer);
                }
            }, interval);

            return () => clearInterval(timer);
        }
    }, []);

    //first get status
    useEffect(() => {
        fetchInstances(true);
    }, []);


    const forceRefresh = useCallback(() => {
        console.log("forceRefresh")
        fetchInstances(true);
    }, [fetchInstances]);

    return {instances, loading, error, refetch: forceRefresh};
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
            setError(error);
            console.error('Error fetching configs:', error);
        } finally {
            if (isInitial) {
                setLoading(false);
            }
        }
    }, []);

    useEffect(() => {
        const unsubscribe = stateChangeEmitter.subscribe(() => {
            fetchConfigs(false);
        });
        return unsubscribe;
    }, [fetchConfigs]);

    useEffect(() => {
        fetchConfigs(true);
    }, [fetchConfigs]);

    return {configs, loading, error, refetch: fetchConfigs};
};
