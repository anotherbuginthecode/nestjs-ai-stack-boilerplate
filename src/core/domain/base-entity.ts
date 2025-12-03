import { UniqueEntityID } from './unique-entity-id';

/**
 * Abstract base class for domain entities.
 * 
 * @typeParam T - The type of the properties object for the entity.
 * 
 * @template T
 * 
 * @remarks
 * This class provides a unique identifier and equality logic for entities.
 * It is intended to be extended by domain-specific entity classes.
 */
export abstract class BaseEntity<T> {
  protected readonly _id: UniqueEntityID;
  protected readonly props: T;

  constructor(props: T, id?: UniqueEntityID) {
    this.props = props;
    this._id = id ?? new UniqueEntityID();
  }

  get id(): UniqueEntityID {
    return this._id;
  }

  equals(object?: BaseEntity<T>): boolean {
    if (object === null || object === undefined) {
      return false;
    }
    if (this === object) {
      return true;
    }
    return this._id.equals(object._id);
  }
}
