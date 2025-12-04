import { UniqueEntityID } from './unique-entity-id';

export interface IDomainEvent {
  dateOccurred: Date;
  getAggregateId(): UniqueEntityID;
}
