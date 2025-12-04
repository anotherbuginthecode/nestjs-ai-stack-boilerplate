import { ValueObject } from "@/core/domain/value-object";
import { Guard } from "@/core/domain/guard";
import { Result } from "@/core/domain/result";

export type ChatRole = "user" | "assistant" | "system" | "tool";
export interface ChatMessageProps {
  role: ChatRole;
  content: string;
  metadata?: Record<string, any>;
}

export class ChatMessage extends ValueObject<ChatMessageProps> {
  private constructor(props: ChatMessageProps) {
    super(props);
  }

  get role(): ChatRole {
    return this.props.role;
  }
  
  get content(): string {
    return this.props.content;
  }

  get metadata(): Record<string, any> | undefined {
    return this.props.metadata;
  }

  public static create(
    role: ChatRole,
    content: string,
    metadata: Record<string, any>
  ): Result<ChatMessage> {

    try{  

      Guard.againstNullOrUndefined({argument: role, argumentName: "role"});
      Guard.againstNullOrUndefined({argument: content, argumentName: "content"});
  
      return Result.ok<ChatMessage>(new ChatMessage({ role, content, metadata: metadata ?? undefined }));
    } catch (error) {
      return Result.fail((error as Error));
    }
  }

}