import { IDomainEvent } from '@/core/domain/domain-event';
import { UniqueEntityID } from '@/core/domain/unique-entity-id';

export class AiTaskFailedEvent implements IDomainEvent {
  public readonly dateOccurred: Date;

  constructor(
    public readonly aggregateId: UniqueEntityID,
    public readonly reason: string,
  ) {
    this.dateOccurred = new Date();
  }

  getAggregateId(): UniqueEntityID {
    return this.aggregateId;
  }
}