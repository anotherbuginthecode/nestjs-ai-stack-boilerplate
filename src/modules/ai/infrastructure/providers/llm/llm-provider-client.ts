import { ChatMessage } from "@/ai/domain/value-objects/chat-message.vo";
import { LLMConfig } from "@/ai/domain/value-objects/llm-config.vo";
import { TokensUsage } from "@/ai/domain/value-objects/tokens-usage.vo";

export interface LLMProviderClient {
  readonly providerName: string;

  supportModel(model: string): boolean;

  chat(input: {
    tenantId?: string;
    projectId?: string;
    messages: ChatMessage[];
    config: LLMConfig;
  }): Promise<{ answer: string; usage?: TokensUsage, raw?: unknown }>;

}