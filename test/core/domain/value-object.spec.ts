// test/core/domain/value-object.spec.ts
import { ValueObject } from '@/core/domain/value-object';

class TestVO extends ValueObject<{ value: string }> {
  get value(): string {
    return this.props.value;
  }
}

describe('ValueObject', () => {
  it('should be equal when props are equal', () => {
    const a = new TestVO({ value: 'test' });
    const b = new TestVO({ value: 'test' });

    expect(a.equals(b)).toBe(true);
    expect(b.equals(a)).toBe(true);
  });

  it('should not be equal when props differ', () => {
    const a = new TestVO({ value: 'test' });
    const b = new TestVO({ value: 'other' });

    expect(a.equals(b)).toBe(false);
  });

  it('should be immutable', () => {
    const a = new TestVO({ value: 'test' });
    expect(() => {
      // @ts-expect-error for test only
      a.props.value = 'changed';
    }).toThrow();
  });
});
