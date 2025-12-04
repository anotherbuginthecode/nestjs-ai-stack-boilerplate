import { ProviderName } from '@/modules/ai/domain/value-objects/provider-name.vo';

describe('ProviderName Value Object', () => {
  it('should create a valid ProviderName', () => {
    const result = ProviderName.create('openai');

    expect(result.isSuccess).toBe(true);
    expect(result.value.value).toBe('openai');
  });

  it('should fail if empty', () => {
    const result = ProviderName.create('   ');

    expect(result.isFailure).toBe(true);
    expect(result.error).toBeInstanceOf(Error);
  });

  it('should fail if contains whitespace', () => {
    const result = ProviderName.create('open ai');

    expect(result.isFailure).toBe(true);
  });

  it('should be equal when underlying value is same', () => {
    const a = ProviderName.create('openai').value;
    const b = ProviderName.create('openai').value;

    expect(a.equals(b)).toBe(true);
  });
});
