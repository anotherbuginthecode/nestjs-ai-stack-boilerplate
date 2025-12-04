import { AiTask } from '../entities/ai-task.entity';
import { UniqueEntityID } from '@/core/domain/unique-entity-id';

export interface AiTaskRepository {
  save(task: AiTask): Promise<void>;

  findById(id: UniqueEntityID): Promise<AiTask | null>;

  /**
   * Useful for worker/queue: get the next tasks in the queue.
   * The concrete implementation will decide how to block/lock.
   */
  findQueued(limit: number): Promise<AiTask[]>;

  findByProjectAndStatus(
    projectId: string,
    status: 'queued' | 'running' | 'completed' | 'failed',
    limit?: number,
  ): Promise<AiTask[]>;

  findByTenantAndStatus(
    tenantId: string,
    status: 'queued' | 'running' | 'completed' | 'failed',
    limit?: number,
  ): Promise<AiTask[]>;
}
