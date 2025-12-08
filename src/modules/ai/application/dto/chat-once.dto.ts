import { ChatRole } from "../../domain/value-objects/chat-message.vo";

export interface ChatOnceInputDTO {
  tenantId?: string | null;
  projectId?: string | null;
  messages: { role: ChatRole; content: string; metadata?: Record<string, any> }[];
  config: {
    provider: string;
    model: string;
    temperature?: number;
    maxTokens?: number;
    [key: string]: any;
  }
};

export interface ChatOnceOutputDTO {
  answer: string;
  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
  raw?: unknown;
}