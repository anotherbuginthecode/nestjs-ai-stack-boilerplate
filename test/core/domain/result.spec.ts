// test/core/domain/result.spec.ts
import { Result } from '@/core/domain/result';

describe('Result', () => {
  it('should create a successful result', () => {
    const result = Result.ok(42);

    expect(result.isSuccess).toBe(true);
    expect(result.isFailure).toBe(false);
    expect(result.value).toBe(42);
  });

  it('should create a failed result', () => {
    const error = new Error('Something went wrong');
    const result = Result.fail<number>(error);

    expect(result.isSuccess).toBe(false);
    expect(result.isFailure).toBe(true);
    expect(() => result.value).toThrow();
    expect(result.error).toBe(error);
  });

  it('should combine a list of successful results', () => {
    const r1 = Result.ok(1);
    const r2 = Result.ok(2);

    const combined = Result.combine([r1, r2]);

    expect(combined.isSuccess).toBe(true);
  });

  it('should fail combine if any result fails', () => {
    const r1 = Result.ok(1);
    const r2 = Result.fail<number>(new Error('fail'));

    const combined = Result.combine([r1, r2]);

    expect(combined.isFailure).toBe(true);
    expect(combined.error).toBeInstanceOf(Error);
  });
});
