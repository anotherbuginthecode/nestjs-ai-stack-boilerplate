import { TokensUsage } from '@/modules/ai/domain/value-objects/tokens-usage.vo';

describe('TokensUsage Value Object', () => {
  it('should create a valid TokensUsage and compute total', () => {
    const result = TokensUsage.create(10, 20);

    expect(result.isSuccess).toBe(true);

    const usage = result.value;
    expect(usage.promptTokens).toBe(10);
    expect(usage.completionTokens).toBe(20);
    expect(usage.totalTokens).toBe(30);
  });

  it('should fail when promptTokens is negative', () => {
    const result = TokensUsage.create(-1, 10);

    expect(result.isFailure).toBe(true);
  });

  it('should fail when completionTokens is negative', () => {
    const result = TokensUsage.create(10, -5);

    expect(result.isFailure).toBe(true);
  });

  it('should be equal for same values', () => {
    const a = TokensUsage.create(5, 7).value;
    const b = TokensUsage.create(5, 7).value;

    expect(a.equals(b)).toBe(true);
  });
});
