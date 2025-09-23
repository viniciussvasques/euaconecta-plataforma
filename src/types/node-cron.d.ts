declare module 'node-cron' {
  interface Task {
    start(): void;
    stop(): void;
    destroy(): void;
    getStatus(): string;
  }

  export function schedule(
    cronExpression: string,
    task: () => void,
    options?: {
      scheduled?: boolean;
      timezone?: string;
    }
  ): Task;
}