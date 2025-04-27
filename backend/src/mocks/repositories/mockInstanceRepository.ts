import { MockInstance } from '@/types';

class MockInstanceRepository {
  private instances: Map<number, MockInstance> = new Map();

  add(port: number, instance: MockInstance): void {
    this.instances.set(port, instance);
  }

  get(port: number): MockInstance | undefined {
    return this.instances.get(port);
  }

  delete(port: number): boolean {
    return this.instances.delete(port);
  }

  getAll(): Map<number, MockInstance> {
    return this.instances;
  }

  has(port: number): boolean {
    return this.instances.has(port);
  }
}

export const mockInstanceRepository = new MockInstanceRepository();
