import { ModelName } from '@/modules/ai/domain/value-objects/model-name.vo';

describe('ModelName Value Object', () => {
  it('should create a valid ModelName', () => {
    const result = ModelName.create('gpt-4.1-mini');

    expect(result.isSuccess).toBe(true);
    expect(result.value.value).toBe('gpt-4.1-mini');
  });

  it('should fail if empty', () => {
    const result = ModelName.create('   ');

    expect(result.isFailure).toBe(true);
    expect(result.error).toBeInstanceOf(Error);
  });

  it('should fail if contains whitespace', () => {
    const result = ModelName.create('gpt 4.1 mini');

    expect(result.isFailure).toBe(true);
  });

  it('should be equal when underlying value is same', () => {
    const a = ModelName.create('gpt-4.1-mini').value;
    const b = ModelName.create('gpt-4.1-mini').value;

    expect(a.equals(b)).toBe(true);
  });
});
