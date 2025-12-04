# Architecture Overview

This project is built using **Domain-Driven Design (DDD)** and a clear separation between:

- **Domain** – pure business rules
- **Application** – use-cases and ports
- **Infrastructure** – technical details (SDKs, databases, queues)

## Core Domain Building Blocks

Located in `src/core/domain`:

- `Result<T>` – explicit success/failure return type
- `ValueObject<TProps>` – immutable value objects
- `BaseEntity`, `AggregateRoot` – entities and aggregates
- `DomainEvents` – simple in-memory domain event dispatcher
- `Guard` – reusable validation helpers

## AI Module

The `ai` module is an opinionated domain around LLM usage:

- `AiTask` aggregate
- `ModelName`, `ChatMessage`, `CallConfig`, `TokensUsage` value objects
- Domain events: `AiTaskCreated`, `AiTaskStarted`, `AiTaskCompleted`, `AiTaskFailed`

The application layer exposes:

- `ChatOnceUseCase` – synchronous chat call
- `EnqueueAiTaskUseCase` – create + enqueue a background task
- `ProcessAiTaskUseCase` – worker-oriented use case

Ports:

- `AiChatPort`, `AiStreamPort`, `QueuePort`, `AiTaskRepository`
