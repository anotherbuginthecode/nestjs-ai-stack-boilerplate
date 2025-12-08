import { AggregateRoot } from '@/core/domain/aggregate-root';
import { UniqueEntityID } from '@/core/domain/unique-entity-id';
import { Result } from '@/core/domain/result';
import { Guard } from '@/core/domain/guard';
import { DomainEvents } from '@/core/domain/domain-events';

import { TokensUsage } from '../value-objects/tokens-usage.vo';
import { AiTaskCreatedEvent } from '../events/ai-task-created.event';
import { AiTaskStartedEvent } from '../events/ai-task-started.event';
import { AiTaskCompletedEvent } from '../events/ai-task-completed.event';
import { AiTaskFailedEvent } from '../events/ai-task-failed.event';

export type AiTaskType = 'chat' | 'embedding' | 'rag';
export type AiTaskStatus = 'queued' | 'running' | 'completed' | 'failed';

interface AiTaskProps {
  tenantId?: string | null;
  projectId?: string | null;
  type: AiTaskType;
  status: AiTaskStatus;
  payload: Record<string, any>;
  result?: Record<string, any> | null;
  errorMessage?: string | null;
  tokensUsage?: TokensUsage | null;
  createdAt: Date;
  updatedAt: Date;
  startedAt?: Date | null;
}

/**
 * Represents an AI task aggregate root in the domain.
 * 
 * Provides read-only accessors for all properties and methods to transition between task states:
 * - "queued" (created)
 * - "running" (started)
 * - "completed" (finished successfully)
 * - "failed" (finished with error)
 * 
 * Domain events are emitted on state transitions.
 *
 * @remarks
 * Use the static {@link AiTask.create} factory to instantiate a new task in the "queued" state.
 * 
 * @example
 * ```typescript
 * const result = AiTask.create({
 *   tenantId: 'tenant-123',
 *   projectId: 'project-456',
 *   type: 'chat',
 *   provider: 'openai',
 *   model: 'gpt-4',
 *   payload: { prompt: 'Hello world' }
 * });
 * if (result.isOk()) {
 *   const task = result.value;
 *   task.start();
 *   task.complete({ result: { text: 'Hi!' } });
 * }
 * ```
 */
export class AiTask extends AggregateRoot<AiTaskProps> {
  private constructor(props: AiTaskProps, id?: UniqueEntityID) {
    super(props, id);
  }

  // Getters for all properties read-only access
  
  get tenantId(): string | null | undefined {
    return this.props.tenantId;
  }
  
  get projectId(): string | null | undefined {
    return this.props.projectId;
  }

  get type(): AiTaskType {
    return this.props.type;
  }

  get status(): AiTaskStatus {
    return this.props.status;
  }

  get payload(): Record<string, any> {
    return this.props.payload;
  }

  get result(): Record<string, any> | null | undefined {
    return this.props.result;
  }

  get errorMessage(): string | null | undefined {
    return this.props.errorMessage;
  }

  get tokensUsage(): TokensUsage | null | undefined {
    return this.props.tokensUsage;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get updatedAt(): Date {
    return this.props.updatedAt;
  }

  get startedAt(): Date | null | undefined {
    return this.props.startedAt;
  }

  /**
   * Factory method to create a new AiTask in "queued" state.
   * Accepts "now" for easier testing.
   */
  static create(params: {
    tenantId?: string | null;
    projectId?: string | null;
    type: AiTaskType;
    payload: Record<string, any>;
    now?: Date;
  }): Result<AiTask> {
    const { tenantId, projectId, type, payload, now } = params;

    try {
      Guard.againstNullOrUndefined({ argument: type, argumentName: 'type' });
      Guard.againstNullOrUndefined({ argument: payload, argumentName: 'payload' });
      Guard.againstNullOrUndefined({ argument: payload.config.provider, argumentName: 'provider' });
      Guard.againstNullOrUndefined({ argument: payload.config.model, argumentName: 'model' });
      Guard.againstNullOrUndefined({ argument: payload.messages, argumentName: 'messages' });
      Guard.againstEmptyArray({ argument: payload.messages, argumentName: 'messages' });

      const timestamp = now ?? new Date();

      const task = new AiTask({
        tenantId: tenantId ?? null,
        projectId: projectId ?? null,
        type,
        status: 'queued',
        payload,
        result: null,
        errorMessage: null,
        tokensUsage: null,
        createdAt: timestamp,
        updatedAt: timestamp,
        startedAt: null,
      });

      const event = new AiTaskCreatedEvent(task.id, type, projectId);
      task.addDomainEvent(event);
      DomainEvents.markAggregateForDispatch(task);

      return Result.ok(task);
    } catch (err) {
      return Result.fail(err as Error);
    }
  }

  /**
   * Transition queued -> running
   */
  start(now: Date = new Date()): void {
    if (this.props.status !== 'queued') {
      throw new Error(`Cannot start AiTask from status ${this.props.status}`);
    }

    this.props.status = 'running';
    this.props.startedAt = now;
    this.props.updatedAt = now;

    const event = new AiTaskStartedEvent(this.id);
    this.addDomainEvent(event);
    DomainEvents.markAggregateForDispatch(this);
  }

  /**
   * Transition running -> completed
   */
  complete(args: { result: Record<string, any>; tokensUsage?: TokensUsage; now?: Date }): void {
    if (this.props.status !== 'running') {
      throw new Error(`Cannot complete AiTask from status ${this.props.status}`);
    }

    const now = args.now ?? new Date();

    this.props.status = 'completed';
    this.props.result = args.result;
    this.props.tokensUsage = args.tokensUsage ?? null;
    this.props.updatedAt = now;

    const event = new AiTaskCompletedEvent(this.id);
    this.addDomainEvent(event);
    DomainEvents.markAggregateForDispatch(this);
  }

  /**
   * Transition running -> failed
   */
  fail(args: { reason: string; now?: Date }): void {
    if (this.props.status !== 'running' && this.props.status !== 'queued') {
      throw new Error(`Cannot fail AiTask from status ${this.props.status}`);
    }

    const now = args.now ?? new Date();

    this.props.status = 'failed';
    this.props.errorMessage = args.reason;
    this.props.updatedAt = now;

    const event = new AiTaskFailedEvent(this.id, args.reason);
    this.addDomainEvent(event);
    DomainEvents.markAggregateForDispatch(this);
  }
}
