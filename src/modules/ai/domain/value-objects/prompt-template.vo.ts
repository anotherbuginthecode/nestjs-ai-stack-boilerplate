import { ValueObject } from "@/core/domain/value-object";
import { Guard } from "@/core/domain/guard";
import { Result } from "@/core/domain/result";


interface PromptTemplateProps {
  name: string;
  description?: string;
  template: string;
  version: number;
  variables: string[];
}


export class PromptTemplate extends ValueObject<PromptTemplateProps> {
  private constructor(props: PromptTemplateProps) {
    super(props);
  }

  get name(): string {
    return this.props.name;
  }

  get description(): string | undefined {
    return this.props.description;
  }

  get template(): string {
    return this.props.template;
  }

  get version(): number {
    return this.props.version;
  }

  get variables(): string[] {
    return this.props.variables;
  }

  public static create(
    name: string,
    template: string,
    version: number = 1,
    variables: string[],
    description?: string,
  ): Result<PromptTemplate> {
    try {
      Guard.againstNullOrUndefined({ argument: name, argumentName: 'name' });
      Guard.againstNullOrUndefined({ argument: template, argumentName: 'template' });
      Guard.againstNullOrUndefined({ argument: version, argumentName: 'version' });
      Guard.againstNullOrUndefined({ argument: variables, argumentName: 'variables' });

      if(version < 1){
        throw new Error('Version must be greater than or equal to 1');
      }

      return Result.ok<PromptTemplate>(
        new PromptTemplate({ name, template, version, variables, description: description ?? undefined }),
      );
    } catch (error) {
      return Result.fail((error as Error));
    }
  }
}