export interface QueuePort {
  enqueue<T>(queueName: string, data: T, opts?: Record<string, unknown>): Promise<void>;
}