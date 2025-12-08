import { ValueObject } from '@/core/domain/value-object';
import { Guard } from '@/core/domain/guard';
import { Result } from '@/core/domain/result';
import { ModelName } from './model-name.vo';
import { ProviderName } from './provider-name.vo';

interface LLMConfigProps {
  provider: ProviderName;
  model: ModelName;
  temperature: number;
  maxTokens?: number;
  topP?: number;
  stream?: boolean;
  [key: string]: any; // Allow additional arbitrary properties
}


export class LLMConfig extends ValueObject<LLMConfigProps> {
  private constructor(props: LLMConfigProps) {
    super(props);
  }

  get provider(): ProviderName {
    return this.props.provider;
  }

  get model(): ModelName {
    return this.props.model;
  }

  get temperature(): number {
    return this.props.temperature;
  }
  
  get maxTokens(): number | undefined {
    return this.props.maxTokens;
  }

  get topP(): number | undefined {
    return this.props.topP;
  }

  get stream(): boolean | undefined {
    return this.props.stream;
  }

  public static create(
    provider: ProviderName,
    model: ModelName,
    temperature: number,
    maxTokens?: number,
    topP?: number,
    stream?: boolean,
    extraProps: { [key: string]: any } = {}
  ): Result<LLMConfig> {
    try {
      Guard.againstNullOrUndefined({ argument: provider, argumentName: 'provider' });
      Guard.againstNullOrUndefined({ argument: model, argumentName: 'model' });
      Guard.againstNullOrUndefined({ argument: temperature, argumentName: 'temperature' });

      Guard.inRange({
        argument: temperature,
        min: 0,
        max: 1,
        argumentName: 'temperature',
      });

      if (maxTokens !== undefined) {
        Guard.inRange({
          argument: maxTokens,
          min: 1,
          max: Number.MAX_SAFE_INTEGER,
          argumentName: 'maxTokens',
        });
      }

      if (topP !== undefined) {
        Guard.inRange({
          argument: topP,
          min: 0,
          max: 1,
          argumentName: 'topP',
        });
      }

      const props: LLMConfigProps = {
        provider,
        model,
        temperature,
        maxTokens,
        topP,
        stream,
        ...extraProps
      };

      return Result.ok<LLMConfig>(new LLMConfig(props));
    } catch (error) {
      return Result.fail((error as Error));
    }
  }
}

