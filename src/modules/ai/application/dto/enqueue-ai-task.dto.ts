import { AiTaskType } from "../../domain/entities/ai-task.entity";

export interface EnqueueAiTaskInputDTO {
  tenantId?: string | null;
  projectId?: string | null;
  type: AiTaskType;
  payload: {
      config: {
        provider: string;
        model: string;
        temperature?: number;
        maxTokens?: number;
        topP?: number;
        stream?: boolean;
        [key: string]: any; // for extra config properties
      },
    messages: Array<{
      role: 'user' | 'assistant' | 'system';
      content: string;
      metadata?: {
        [key: string]: any;
      },
      [key: string]: any; // for extra message properties
    }>;
    [key: string]: any; // for extra payload properties
  };
  queueName?: string;
  queueOpts?: Record<string, unknown>;
}

export interface EnqueueAiTaskResultDTO {
  taskId: string;
}