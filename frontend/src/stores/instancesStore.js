// frontend/src/stores/instancesStore.js
import { syncEmitter } from '../hooks/useDataFetching';

class InstancesStore {
  constructor() {
    this.listeners = new Set();
    this.optimisticInstance = null;
  }

  subscribe(listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  notify() {
    this.listeners.forEach(listener => listener());
  }

  addOptimisticInstance(instance) {
    this.optimisticInstance = instance;
    this.notify();
    syncEmitter.emit();
  }

  removeOptimisticInstance() {
    this.optimisticInstance = null;
    this.notify();
    syncEmitter.emit();
  }

  getOptimisticInstance() {
    return this.optimisticInstance;
  }
}

export const instancesStore = new InstancesStore();