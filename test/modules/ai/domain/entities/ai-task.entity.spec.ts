import { AiTask, AiTaskStatus } from '@/modules/ai/domain/entities/ai-task.entity';
import { ProviderName } from '@/modules/ai/domain/value-objects/provider-name.vo';
import { ModelName } from '@/modules/ai/domain/value-objects/model-name.vo';
import { TokensUsage } from '@/modules/ai/domain/value-objects/tokens-usage.vo';
import { DomainEvents } from '@/core/domain/domain-events';
import { AiTaskCreatedEvent } from '@/modules/ai/domain/events/ai-task-created.event';
import { AiTaskStartedEvent } from '@/modules/ai/domain/events/ai-task-started.event';
import { AiTaskCompletedEvent } from '@/modules/ai/domain/events/ai-task-completed.event';
import { AiTaskFailedEvent } from '@/modules/ai/domain/events/ai-task-failed.event';
import { IDomainEvent } from '@/core/domain/domain-event';

describe('AiTask Aggregate', () => {
  const fixedNow = new Date('2025-01-01T12:00:00.000Z');

  beforeEach(() => {
    DomainEvents.clearHandlers();
    DomainEvents.clearMarkedAggregates();
  });

  it('should create a queued AiTask with domain event', () => {
    const provider = ProviderName.create('openai').value;
    const model = ModelName.create('gpt-4.1-mini').value;

    const result = AiTask.create({
      tenantId: 'tenant_1',
      projectId: 'proj_1',
      type: 'chat',
      provider,
      model,
      payload: { messages: [] },
      now: fixedNow,
    });

    expect(result.isSuccess).toBe(true);

    const task = result.value;
    expect(task.status).toBe<'queued'>('queued');
    expect(task.createdAt.toISOString()).toBe(fixedNow.toISOString());
    expect(task.updatedAt.toISOString()).toBe(fixedNow.toISOString());

    const events = task.domainEvents;
    expect(events.length).toBe(1);
    expect(events[0]).toBeInstanceOf(AiTaskCreatedEvent);
  });

  it('should go from queued to running and emit event', () => {
    const provider = ProviderName.create('openai').value;
    const model = ModelName.create('gpt-4.1-mini').value;
    const created = AiTask.create({
      tenantId: 'tenant_1',
      projectId: 'proj_1',
      type: 'chat',
      provider,
      model,
      payload: { messages: [] },
      now: fixedNow,
    }).value;

    const startTime = new Date('2025-01-01T12:01:00.000Z');
    created.start(startTime);

    expect(created.status).toBe<'running'>('running');
    expect(created.startedAt?.toISOString()).toBe(startTime.toISOString());
    expect(created.updatedAt.toISOString()).toBe(startTime.toISOString());

    const events = created.domainEvents;
    // 1 created + 1 started
    expect(events.some(e => e instanceof AiTaskCreatedEvent)).toBe(true);
    expect(events.some(e => e instanceof AiTaskStartedEvent)).toBe(true);
  });

  it('should go from running to completed with result and tokensUsage', () => {
    const provider = ProviderName.create('openai').value;
    const model = ModelName.create('gpt-4.1-mini').value;
    const task = AiTask.create({
      tenantId: 'tenant_1',
      projectId: 'proj_1',
      type: 'chat',
      provider,
      model,
      payload: { messages: [] },
      now: fixedNow,
    }).value;

    task.start(new Date('2025-01-01T12:01:00.000Z'));

    const tokens = TokensUsage.create(10, 20).value;
    const completeTime = new Date('2025-01-01T12:02:00.000Z');

    task.complete({
      result: { answer: 'Hello!' },
      tokensUsage: tokens,
      now: completeTime,
    });

    expect(task.status).toBe<'completed'>('completed');
    expect(task.result).toEqual({ answer: 'Hello!' });
    expect(task.tokensUsage?.totalTokens).toBe(30);
    expect(task.updatedAt.toISOString()).toBe(completeTime.toISOString());

    const events = task.domainEvents;
    expect(events.some(e => e instanceof AiTaskCompletedEvent)).toBe(true);
  });

  it('should go to failed state with reason', () => {
    const provider = ProviderName.create('openai').value;
    const model = ModelName.create('gpt-4.1-mini').value;
    const task = AiTask.create({
      tenantId: 'tenant_1',
      projectId: 'proj_1',
      type: 'chat',
      provider,
      model,
      payload: { messages: [] },
      now: fixedNow,
    }).value;

    task.start(new Date('2025-01-01T12:01:00.000Z'));

    const failTime = new Date('2025-01-01T12:02:00.000Z');
    task.fail({ reason: 'Timeout', now: failTime });

    expect(task.status).toBe<'failed'>('failed');
    expect(task.errorMessage).toBe('Timeout');
    expect(task.updatedAt.toISOString()).toBe(failTime.toISOString());

    const events = task.domainEvents;
    expect(events.some(e => e instanceof AiTaskFailedEvent)).toBe(true);
  });

  it('should dispatch events through DomainEvents dispatcher', () => {
    const provider = ProviderName.create('openai').value;
    const model = ModelName.create('gpt-4.1-mini').value;
    const result = AiTask.create({
      tenantId: 'tenant_1',
      projectId: 'proj_1',
      type: 'chat',
      provider,
      model,
      payload: { messages: [] },
      now: fixedNow,
    });

    const task = result.value;

    let createdHandled = false;

    DomainEvents.register((event: IDomainEvent) => {
      createdHandled = true;
      expect(event).toBeInstanceOf(AiTaskCreatedEvent);
    }, AiTaskCreatedEvent.name);

    DomainEvents.dispatchEventsForAggregate(task.id);

    expect(createdHandled).toBe(true);
    expect(task.domainEvents.length).toBe(0);
  });

  it('should not allow invalid state transitions', () => {
    const provider = ProviderName.create('openai').value;
    const model = ModelName.create('gpt-4.1-mini').value;
    const task = AiTask.create({
      tenantId: 'tenant_1',
      projectId: 'proj_1',
      type: 'chat',
      provider,
      model,
      payload: { messages: [] },
      now: fixedNow,
    }).value;

    // prova a completare senza start
    expect(() =>
      task.complete({ result: {}, now: fixedNow }),
    ).toThrow();

    // porta in failed da queued (permesso dal nostro modello)
    task.fail({ reason: 'Cancelled', now: fixedNow });
    expect(task.status).toBe<'failed'>('failed');

    // prova a ri-start dopo failed → errore
    expect(() => task.start(fixedNow)).toThrow();
  });
});
