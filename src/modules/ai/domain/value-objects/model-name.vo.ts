import { ValueObject } from "@/core/domain/value-object";
import { Guard } from "@/core/domain/guard";
import { Result } from "@/core/domain/result";

interface ModelNameProps {
  value: string;
}

export class ModelName extends ValueObject<ModelNameProps> {
  private constructor(props: ModelNameProps) {
    super(props);
  }

  public static create(value: string): Result<ModelName> {

    try {
      // Validation -> throw errors if invalid
      Guard.againstNullOrUndefined({argument: value, argumentName: 'ModelName'});
      Guard.againstEmptyString({argument: value, argumentName: 'ModelName'});

      if (/\s/.test(value)) {
        return Result.fail(new Error('ModelName cannot contain whitespace'));
      }

      return Result.ok<ModelName>(new ModelName({ value: value }));
    } catch (error) {
      return Result.fail(error as Error);
    }
  }

  public get value(): string {
    return this.props.value;
  }
}