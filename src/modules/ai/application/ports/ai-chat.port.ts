import { ChatMessage } from "../../domain/value-objects/chat-message.vo";
import { LLMConfig } from "../../domain/value-objects/llm-config.vo";
import { TokensUsage } from "../../domain/value-objects/tokens-usage.vo";

/**
 * Port interface for AI chat functionality.
 * 
 * Implementations of this interface should provide a method to interact with an AI chat model,
 * given a set of messages and configuration options.
 *
 * @remarks
 * - The `chat` method accepts an input object containing optional tenant and project identifiers,
 *   an array of chat messages, and a configuration for the language model.
 * - Returns a promise resolving to an object containing the AI-generated answer, optional token usage statistics,
 *   and optional raw response data.
 *
 * @method
 * @param input - The input parameters for the chat interaction.
 * @param input.tenantId - (Optional) Identifier for the tenant.
 * @param input.projectId - (Optional) Identifier for the project.
 * @param input.messages - Array of chat messages to provide context for the AI.
 * @param input.config - Configuration for the language model.
 * @returns Promise resolving to an object with the AI's answer, optional usage data, and optional raw response.
 */
export interface AIChatPort {
  chat(input: {
    tenantId?: string | null;
    projectId?: string | null;
    messages: ChatMessage[];
    config: LLMConfig;
  }): Promise<{ answer: string; usage?: TokensUsage, raw?: unknown }>;
}