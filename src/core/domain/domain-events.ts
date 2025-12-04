// src/core/domain/domain-events.ts
import { IDomainEvent } from './domain-event';
import { UniqueEntityID } from './unique-entity-id';
import { AggregateRoot } from './aggregate-root';

type DomainEventCallback = (event: IDomainEvent) => void;

export class DomainEvents {
  private static handlersMap: Record<string, DomainEventCallback[]> = {};
  private static markedAggregates: AggregateRoot<any>[] = [];

  /**
   * Registra un handler per un certo tipo di evento
   */
  static register(
    callback: DomainEventCallback,
    eventClassName: string,
  ): void {
    if (!this.handlersMap[eventClassName]) {
      this.handlersMap[eventClassName] = [];
    }
    this.handlersMap[eventClassName].push(callback);
  }

  static clearHandlers(): void {
    this.handlersMap = {};
  }

  static clearMarkedAggregates(): void {
    this.markedAggregates = [];
  }

  static markAggregateForDispatch(aggregate: AggregateRoot<any>): void {
    if (!this.markedAggregates.find(a => a.id.equals(aggregate.id))) {
      this.markedAggregates.push(aggregate);
    }
  }

  static dispatchEventsForAggregate(id: UniqueEntityID): void {
    const aggregate = this.markedAggregates.find(a => a.id.equals(id));
    if (!aggregate) return;

    const events = aggregate.pullDomainEvents();
    for (const event of events) {
      this.dispatch(event);
    }

    this.markedAggregates = this.markedAggregates.filter(a => !a.id.equals(id));
  }

  private static dispatch(event: IDomainEvent): void {
    const eventClassName = event.constructor.name;

    const handlers = this.handlersMap[eventClassName] ?? [];
    for (const handler of handlers) {
      handler(event);
    }
  }
}
