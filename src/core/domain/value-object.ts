/**
 * Recursively freezes an object and all of its nested properties, making them immutable.
 *
 * @template T - The type of the object to freeze.
 * @param obj - The object to be deeply frozen.
 * @returns The deeply frozen object.
 */
function deepFreeze<T>(obj: T): T {
  Object.getOwnPropertyNames(obj).forEach((prop) => {
    const value = (obj as any)[prop];
    if (value && typeof value === 'object') {
      deepFreeze(value);
    }
  });
  return Object.freeze(obj);
}

/**
 * Abstract base class for value objects, enforcing immutability and equality comparison.
 *
 * @typeParam TProps - The shape of the properties that define the value object.
 *
 * Value objects are compared based on their properties rather than their identity.
 * The properties are deeply frozen to prevent mutation.
 */
export abstract class ValueObject<TProps extends Record<string, any>> {
  protected readonly props: TProps;

  constructor(props: TProps) {
    this.props = deepFreeze({ ...props });
  }

  public equals(vo?: ValueObject<TProps>): boolean {
    if (vo === null || vo === undefined) return false;
    if (vo.props === undefined) return false;
    return JSON.stringify(this.props) === JSON.stringify(vo.props);
  }
}
