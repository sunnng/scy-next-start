// utils/clientStore.ts
interface ClientCommand {
  clientId: string;
  resolve: (command: unknown) => void;
  timeout: NodeJS.Timeout;
}

// 客户端最后活跃时间戳存储
export const clientLastSeen = new Map<string, number>();

// 待发送指令队列（按客户端 ID 分组）
export const clientCommands = new Map<string, any[]>();

// 挂起的长轮询请求队列
export const pendingRequests = new Map<string, ClientCommand[]>();
