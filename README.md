# NestJS GenAI Stack (WIP)

An opinionated **AI application framework for NestJS**, built with **DDD principles** and designed to bootstrap projects that use LLMs (sync, async, streaming, RAG).

## ✨ Features (v1)

- **Clean DDD layers**
  - `core` domain building blocks (Result, ValueObject, AggregateRoot, DomainEvents)
  - `ai` module with domain entities (`AiTask`), value objects (`ModelName`, `ChatMessage`, `CallConfig`, `TokensUsage`)

- **Application layer ports**
  - `AiChatPort` – sync chat completions
  - `AiStreamPort` – streaming completions (AsyncIterable)
  - `QueuePort` – abstract queue interface
  - `AiTaskRepository` – domain repository interface

- **Infrastructure adapters**
  - `MultiProviderAiChatAdapter` – routes models to providers
  - `OpenAiChatClient` – OpenAI chat implementation
  - `MultiProviderAiStreamAdapter` + `OpenAiStreamClient` – basic streaming support
  - `BullQueueAdapter` – BullMQ-based queue adapter
  - `AiTaskInMemoryRepository` – in-memory repo for testing & demos
  - `AiTaskPrismaRepository` (example) – persistence adapter for relational DBs

## 🧱 Architecture at a glance

```txt
core/
  domain/...
  application/...

modules/
  ai/
    domain/...
    application/...
    infrastructure/...
```

- **Domain**: pure TypeScript, no Nest imports, no SDKs.
- **Application**: use cases + ports (interfaces).
- **Infrastructure**: adapters for LLM providers, queues, databases.

## 🚀 Quick Start

> **Note:** This project is in early development. V1 is still under active development.

1. Install dependencies:

```bash
npm install @nestjs/common openai bullmq
# plus your ORM / prisma / typeorm etc.
```

2. Import the AiModule in your NestJS application (example):

```typescript
@Module({
  imports: [AiModule],
})
export class AppModule {}
```

3. Use the ChatOnceUseCase in a controller:

```typescript
@Controller('ai')
export class AiController {
  constructor(private readonly chatOnce: ChatOnceUseCase) {}

  @Post('chat')
  async chat(@Body() body: ChatOnceInput) {
    const result = await this.chatOnce.execute(body);
    if (result.isFailure) {
      throw new BadRequestException(result.error.message);
    }
    return result.value;
  }
}
```

## 🛠️ Development

Clone the repository and install dependencies:

```bash
git clone https://github.com/anotherbuginthecode/nestjs-ai-stack-boilerplate.git
cd nestjs-ai-stack-boilerplate
npm install
```

Run the development server:

```bash
npm run start:dev
```

Run tests:

```bash
npm run test
```

## 🧪 Testing

The framework is designed to be fully testable:

**Domain**: pure unit tests for value objects and aggregates.

**Application**: use-case tests with mocked ports.

**Infrastructure**: adapter tests with mocked SDKs (OpenAI, BullMQ, DB).

See the `test/` folder for examples.

## Architecture Overview

- [Architecture Overview](docs/architecture-overview.md)

## 📚 Documentation

- [NestJS Documentation](https://docs.nestjs.com/)
- [OpenAI API Reference](https://platform.openai.com/docs/api-reference)
- [BullMQ Documentation](https://docs.bullmq.io/)

## 🤝 Contributing

Contributions are welcome! Please open issues or submit pull requests for improvements and bug fixes.
