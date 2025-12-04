import { IDomainEvent } from '@/core/domain/domain-event';
import { UniqueEntityID } from '@/core/domain/unique-entity-id';

export class AiTaskCreatedEvent implements IDomainEvent {
  public readonly dateOccurred: Date;

  constructor(
    public readonly aggregateId: UniqueEntityID,
    public readonly taskType: 'chat' | 'embedding' | 'rag',
    public readonly projectId?: string | null,
  ) {
    this.dateOccurred = new Date();
  }

  getAggregateId(): UniqueEntityID {
    return this.aggregateId;
  }
}
