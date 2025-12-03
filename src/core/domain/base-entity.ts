import { UniqueEntityID } from './unique-entity-id';

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
