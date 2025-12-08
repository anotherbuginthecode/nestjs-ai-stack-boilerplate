import { ChatMessage } from "../../domain/value-objects/chat-message.vo";
import { LLMConfig } from "../../domain/value-objects/llm-config.vo";
import { TokensUsage } from "../../domain/value-objects/tokens-usage.vo";

export interface StreamChunk {
  content: string;
  done: boolean;
}

export interface StreamResult {
  chunks: AsyncIterable<StreamChunk>;
  usage?: TokensUsage;
}


export interface AIStreamPort {
  stream(input: {
    tenantId?: string | null;
    projectId?: string | null;
    messages: ChatMessage[];
    config: LLMConfig;
  }): Promise<StreamResult>;
}

