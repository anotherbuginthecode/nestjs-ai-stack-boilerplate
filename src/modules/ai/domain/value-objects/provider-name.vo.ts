import { ValueObject } from "@/core/domain/value-object";
import { Guard } from "@/core/domain/guard";
import { Result } from "@/core/domain/result";

interface ProviderNameProps {
  value: string;
}

export class ProviderName extends ValueObject<ProviderNameProps> {
  private constructor(props: ProviderNameProps) {
    super(props);
  }

  public static create(value: string): Result<ProviderName> {

    try {
      // Validation -> throw errors if invalid
      Guard.againstNullOrUndefined({argument: value, argumentName: 'ProviderName'});
      Guard.againstEmptyString({argument: value, argumentName: 'ProviderName'});

      if (/\s/.test(value)) {
        return Result.fail(new Error('ProviderName cannot contain whitespace'));
      }

      return Result.ok<ProviderName>(new ProviderName({ value: value }));
    } catch (error) {
      return Result.fail(error as Error);
    }
  }

  public get value(): string {
    return this.props.value;
  }
}