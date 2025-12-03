/**
 * Represents a unique identifier for an entity.
 *
 * This class encapsulates the logic for generating and comparing unique entity IDs.
 * If no ID is provided to the constructor, a new one is generated using `crypto.randomUUID`
 * if available, otherwise a random string is created.
 *
 * @example
 * const id1 = new UniqueEntityID();
 * const id2 = new UniqueEntityID('custom-id');
 * console.log(id1.value); // Prints the generated or provided ID
 * console.log(id1.equals(id2)); // Compares two IDs
 */
export class UniqueEntityID {
  private readonly _value: string;

  constructor(id?: string) {
    this._value = id ?? UniqueEntityID.generate();
  }

  get value(): string {
    return this._value;
  }

  toString(): string {
    return this._value;
  }

  equals(id?: UniqueEntityID): boolean {
    if (id === null || id === undefined) {
      return false;
    }
    return id.value === this._value;
  }

  private static generate(): string {
    return crypto.randomUUID
      ? crypto.randomUUID()
      : Math.random().toString(36).substring(2, 15) +
          Math.random().toString(36).substring(2, 15);
  }
}
