// test/modules/ai/application/use-cases/chat-once.use-case.spec.ts
import { ChatOnceUseCase } from '../../../../../src/modules/ai/application/use-cases/chat-once.use-case';
import { AIChatPort } from '../../../../../src/modules/ai/application/ports/ai-chat.port';
import { ChatOnceInputDTO } from '../../../../../src/modules/ai/application/dto/chat-once.dto';
import { TokensUsage } from '../../../../../src/modules/ai/domain/value-objects/tokens-usage.vo';
import { Result } from '../../../../../src/core/domain/result';

class AiChatPortMock implements AIChatPort {
  public calledWith: any;

  async chat(input: 
    { tenantId?: string | null; projectId?: string | null; messages: any[]; config: any; }): Promise<{ answer: string; usage?: TokensUsage; raw?: unknown }> {
    this.calledWith = input;
    const usage = TokensUsage.create(10, 20).value;

    return {
      answer: 'mocked reply',
      usage,
      raw: { some: 'data' }
    };
  }
}

describe('ChatOnceUseCase', () => {
  it('should call AiChatPort and return reply + usage', async () => {
    const port = new AiChatPortMock();
    const useCase = new ChatOnceUseCase(port);

    const input: ChatOnceInputDTO = {
      tenantId: 'tenant_1',
      projectId: 'proj_1',
      config: {
        model: 'gpt-4.1-mini',
        provider: 'openai'
      },
      messages: [
        { role: 'user', content: 'Hello' },
      ],
    };

    const result = await useCase.execute(input);
    expect(result.isSuccess).toBe(true);
  });

  it('should fail on invalid model name', async () => {
    const port = new AiChatPortMock();
    const useCase = new ChatOnceUseCase(port);

    const input: ChatOnceInputDTO = {
      config: {
        model: '   ',
        provider: "openai",
      }, // invalid
      messages: [{ role: 'user', content: 'test' }],
    };

    const result = await useCase.execute(input);

    expect(result.isFailure).toBe(true);
    expect(result.error).toBeInstanceOf(Error);
  });
});
