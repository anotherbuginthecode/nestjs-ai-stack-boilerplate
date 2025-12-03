import { BaseEntity } from './base-entity';
import { IDomainEvent } from './domain-event';

export abstract class AggregateRoot<T> extends BaseEntity<T> {
  private _domainEvents: IDomainEvent[] = [];

  get domainEvents(): IDomainEvent[] {
    return [...this._domainEvents];
  }

  protected addDomainEvent(event: IDomainEvent): void {
    this._domainEvents.push(event);
  }

  public clearDomainEvents(): void {
    this._domainEvents = [];
  }

  /**
   * fetch and remove all domain events.
   * utility method for testing and event dispatching.
   */

  public pullDomainEvents(): IDomainEvent[] {
    const events = [...this._domainEvents];
    this.clearDomainEvents();
    return events;
  }
}
