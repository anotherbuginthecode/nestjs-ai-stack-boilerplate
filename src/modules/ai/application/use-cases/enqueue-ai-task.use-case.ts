import { UseCase } from "@/core/application/use-case.interface";
import { Result } from "@/core/domain/result";

import { EnqueueAiTaskInputDTO, EnqueueAiTaskResultDTO } from "../dto/enqueue-ai-task.dto";
import { QueuePort } from "../ports/queue.port";
import { AiTaskRepository } from "../../domain/repositories/ai-task.repository";
import { ModelName } from "../../domain/value-objects/model-name.vo";
import { ProviderName } from "../../domain/value-objects/provider-name.vo";
import { AiTask } from "../../domain/entities/ai-task.entity";
import { LLMConfig } from "../../domain/value-objects/llm-config.vo";

export class EnqueueAiTaskUseCase implements UseCase<EnqueueAiTaskInputDTO, Result<EnqueueAiTaskResultDTO>> {
  
  private readonly defaultQueueName = 'ai-tasks';
  
  constructor(
    private readonly aiTaskRepository: AiTaskRepository,
    private readonly queue: QueuePort
  ) {}

  async execute(input: EnqueueAiTaskInputDTO): Promise<Result<EnqueueAiTaskResultDTO>> {

    // 3. Create AiTask entity
    const aiTaskOrError = AiTask.create({
      tenantId: input.tenantId,
      projectId: input.projectId,
      type: input.type,
      payload: input.payload
    });
    if (aiTaskOrError.isFailure) {
      return Result.fail<EnqueueAiTaskResultDTO>(aiTaskOrError.error!);
    }
    const aiTask = aiTaskOrError.value;

    // 4. Persist AiTask
    await this.aiTaskRepository.save(aiTask);

    // 5. Enqueue task in the queue system
    const queueName = input.queueName || this.defaultQueueName;
    await this.queue.enqueue(queueName, {
      taskId: aiTask.id.value,
      tenantId: aiTask.tenantId,
      projectId: aiTask.projectId,
      type: aiTask.type,
      payload: aiTask.payload
    });

    // 6. Return result
    return Result.ok<EnqueueAiTaskResultDTO>({
      taskId: aiTask.id.value
    });
  }
}