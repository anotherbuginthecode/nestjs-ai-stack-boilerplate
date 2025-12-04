import { ValueObject } from '@/core/domain/value-object';
import { Guard } from '@/core/domain/guard';
import { Result } from '@/core/domain/result';

interface TokensUsageProps {
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
}

export class TokensUsage extends ValueObject<TokensUsageProps> {
  private constructor(props: TokensUsageProps) {
    super(props);
  }

  get promptTokens(): number {
    return this.props.promptTokens;
  }

  get completionTokens(): number {
    return this.props.completionTokens;
  }

  get totalTokens(): number {
    return this.props.totalTokens;
  }

  
  static create(promptTokens: number, completionTokens: number): Result<TokensUsage> {
    try {
      Guard.againstNullOrUndefined({ argument: promptTokens, argumentName: 'promptTokens' });
      Guard.againstNullOrUndefined({ argument: completionTokens, argumentName: 'completionTokens' });

      Guard.inRange({
        argument: promptTokens,
        min: 0,
        max: Number.MAX_SAFE_INTEGER,
        argumentName: 'promptTokens',
      });

      Guard.inRange({
        argument: completionTokens,
        min: 0,
        max: Number.MAX_SAFE_INTEGER,
        argumentName: 'completionTokens',
      });

      const totalTokens = promptTokens + completionTokens;

      return Result.ok(
        new TokensUsage({
          promptTokens,
          completionTokens,
          totalTokens,
        }),
      );
    } catch (err) {
      return Result.fail(err as Error);
    }
  }
}
