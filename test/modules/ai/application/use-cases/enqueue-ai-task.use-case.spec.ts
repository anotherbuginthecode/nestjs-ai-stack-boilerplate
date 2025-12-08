// test/modules/ai/application/use-cases/enqueue-ai-task.use-case.spec.ts
import { EnqueueAiTaskUseCase } from '../../../../../src/modules/ai/application/use-cases/enqueue-ai-task.use-case';
import { EnqueueAiTaskInputDTO } from '../../../../../src/modules/ai/application/dto/enqueue-ai-task.dto';
import { AiTaskRepository } from '../../../../../src/modules/ai/domain/repositories/ai-task.repository';
import { AiTask } from '../../../../../src/modules/ai/domain/entities/ai-task.entity';
import { UniqueEntityID } from '@/core/domain/unique-entity-id';
import { QueuePort } from '../../../../../src/modules/ai/application/ports/queue.port';

class AiTaskRepositoryMock implements AiTaskRepository {
  public savedTasks: AiTask[] = [];

  async save(task: AiTask): Promise<void> {
    this.savedTasks.push(task);
  }

  async findById(): Promise<AiTask | null> {
    return null;
  }

  async findQueued(): Promise<AiTask[]> {
    return [];
  }

  async findByProjectAndStatus(): Promise<AiTask[]> {
    return [];
  }

  async findByTenantAndStatus(): Promise<AiTask[]> {
    return [];
  }
}

class QueuePortMock implements QueuePort {
  public enqueued: { queueName: string; payload: any }[] = [];

  async enqueue(queueName: string, payload: any): Promise<void> {
    this.enqueued.push({ queueName, payload });
  }
}

describe('EnqueueAiTaskUseCase', () => {
  it('should create AiTask, save it and enqueue job', async () => {
    const repo = new AiTaskRepositoryMock();
    const queue = new QueuePortMock();

    const useCase = new EnqueueAiTaskUseCase(repo, queue);

    const input: EnqueueAiTaskInputDTO = {
      projectId: 'proj_1',
      type: 'chat',
      payload: { 
        config: {
          provider: 'openai',
          model: 'gpt-4.1-mini',
        },
        messages: [{ role: 'user', content: 'Hello' }] },
    };

    const result = await useCase.execute(input);

    expect(result.isSuccess).toBe(true);
    const taskId = result.value.taskId;
    expect(taskId).toBeDefined();

    // check save
    expect(repo.savedTasks.length).toBe(1);
    expect(repo.savedTasks[0].id.value).toBe(taskId);

    // check enqueue
    expect(queue.enqueued.length).toBe(1);
    expect(queue.enqueued[0].queueName).toBe('ai-tasks');
    expect(queue.enqueued[0].payload.taskId).toBe(taskId);
  });


      it('should fail if messages is missing', async () => {
        const repo = new AiTaskRepositoryMock();
        const queue = new QueuePortMock();
        const useCase = new EnqueueAiTaskUseCase(repo, queue);
        const input: EnqueueAiTaskInputDTO = {
          projectId: 'proj_1',
          type: 'chat',
          payload: {
            config: { provider: 'openai', model: 'gpt-4.1-mini' }
            // messages mancante
          } as any,
        };
        const result = await useCase.execute(input);
        expect(result.isFailure).toBe(true);
      });

      it('should ignore extra fields in payload', async () => {
        const repo = new AiTaskRepositoryMock();
        const queue = new QueuePortMock();
        const useCase = new EnqueueAiTaskUseCase(repo, queue);
        const input: EnqueueAiTaskInputDTO = {
          projectId: 'proj_1',
          type: 'chat',
          payload: {
            config: { provider: 'openai', model: 'gpt-4.1-mini' },
            messages: [{ role: 'user', content: 'Hello' }],
            extraField: 'shouldBeIgnored',
          } as any,
        };
        const result = await useCase.execute(input);
        expect(result.isSuccess).toBe(true);
      });

      it('should fail if messages is empty', async () => {
        const repo = new AiTaskRepositoryMock();
        const queue = new QueuePortMock();
        const useCase = new EnqueueAiTaskUseCase(repo, queue);
        const input: EnqueueAiTaskInputDTO = {
          projectId: 'proj_1',
          type: 'chat',
          payload: {
            config: { provider: 'openai', model: 'gpt-4.1-mini' },
            messages: [],
          },
        };
        const result = await useCase.execute(input);
        expect(result.isFailure).toBe(true);
      });
});
