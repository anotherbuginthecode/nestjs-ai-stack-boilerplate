import { UseCase } from "@/core/application/use-case.interface";
import { Result } from "@/core/domain/result";

import { AIChatPort } from "../ports/ai-chat.port";
import { ChatOnceInputDTO, ChatOnceOutputDTO } from "../dto/chat-once.dto";
import { ModelName } from "../../domain/value-objects/model-name.vo";
import { ProviderName } from "../../domain/value-objects/provider-name.vo";
import { ChatMessage } from "../../domain/value-objects/chat-message.vo";
import { LLMConfig } from "../../domain/value-objects/llm-config.vo";

export class ChatOnceUseCase implements UseCase<ChatOnceInputDTO, Result<ChatOnceOutputDTO>> {
  constructor(private readonly aiChat: AIChatPort) {}

  async execute(input: ChatOnceInputDTO): Promise<Result<ChatOnceOutputDTO>> {



    // 1. VO ModelName and ProviderName
    const model = ModelName.create(input.config.model);
    if (model.isFailure) {
      return Result.fail<ChatOnceOutputDTO>(model.error!);
    }
    const modelName = model.value;

    const provider = ProviderName.create(input.config.provider);
    if (provider.isFailure) {
      return Result.fail<ChatOnceOutputDTO>(provider.error!);
    }
    const providerName = provider.value;
    
    // 2. VO ChatMessages[]
    const chatMessages = this.buildMessages(input);
    if (chatMessages.isFailure) {
      return Result.fail<ChatOnceOutputDTO>(chatMessages.error!);
    }
    const messages = chatMessages.value;

    // 3. VO LLMConfig
    const llmConfigOrError = LLMConfig.create(
      providerName,
      modelName,
      input.config.temperature || 0,
      input.config.maxTokens || 256,
      input.config.topP,
      input.config.stream,
      input.config // pass all extra properties
    );
    if (llmConfigOrError.isFailure) {
      return Result.fail<ChatOnceOutputDTO>(llmConfigOrError.error!);
    }
    const llmConfig = llmConfigOrError.value;

    // 4. Call AIChatPort
    const aiResponse = await this.aiChat.chat(
      {
        tenantId: input.tenantId,
        projectId: input.projectId,
        messages: messages,
        config: llmConfig
      }
    );

    // 5. Build Output DTO
    const output: ChatOnceOutputDTO = {
      answer: aiResponse.answer,
      usage: aiResponse.usage ? {
        promptTokens: aiResponse.usage.promptTokens,
        completionTokens: aiResponse.usage.completionTokens,
        totalTokens: aiResponse.usage.totalTokens
      } : undefined,
      raw: aiResponse.raw
    };
    
    return Result.ok<ChatOnceOutputDTO>(output);
  }

  private buildMessages(inputMessages: ChatOnceInputDTO): Result<ChatMessage[]> {
    const chatMessages: ChatMessage[] = [];
    for (const raw of inputMessages.messages) {
      const chatMessageOrError = ChatMessage.create(
        raw.role,
        raw.content,
        raw.metadata
      );
      if (chatMessageOrError.isFailure) {
        return Result.fail<ChatMessage[]>(chatMessageOrError.error!);
      }
      chatMessages.push(chatMessageOrError.value);
    }
    return Result.ok<ChatMessage[]>(chatMessages);
  }
}