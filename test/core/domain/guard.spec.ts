// test/core/domain/guard.spec.ts
import { Guard } from '@/core/domain/guard';

describe('Guard', () => {
  it('againstNullOrUndefined should throw on null', () => {
    expect(() =>
      Guard.againstNullOrUndefined({ argument: null, argumentName: 'test' }),
    ).toThrow();
  });

  it('againstEmptyString should throw on empty', () => {
    expect(() =>
      Guard.againstEmptyString({ argument: '  ', argumentName: 'test' }),
    ).toThrow();
  });

  it('inRange should throw when out of range', () => {
    expect(() =>
      Guard.inRange({ argument: 5, min: 10, max: 20, argumentName: 'value' }),
    ).toThrow();
  });

  it('inRange should not throw when in range', () => {
    expect(() =>
      Guard.inRange({ argument: 15, min: 10, max: 20, argumentName: 'value' }),
    ).not.toThrow();
  });
});
