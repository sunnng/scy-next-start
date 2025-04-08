import {
  clientCommands,
  clientLastSeen,
  pendingRequests,
} from "@/lib/clientStore";
import { Hono } from "hono";

const app = new Hono()
  .get("/heartbeat", (c) => {
    const clientId = c.req.header("x-client-id");

    if (!clientId) {
      return c.json(
        {
          message: "no clientId",
        },
        400
      );
    }

    // 更新最后活跃时间
    clientLastSeen.set(clientId, Date.now());

    return c.json({
      status: "ok",
    });
  })
  // 长轮询接口
  .post("/poll", async (c) => {
    const clientId = c.req.header("x-client-id");
    if (!clientId) {
      return c.json({ code: 4001, message: "Missing clientId header" }, 400);
    }

    // 检测是否有重复挂起的请求
    const existingRequests = pendingRequests.get(clientId) || [];
    if (existingRequests.length > 0) {
      return c.json({ code: 4002, message: "Duplicate polling request" }, 400);
    }

    try {
      clientLastSeen.set(clientId, Date.now());

      // 检查现有命令
      const commands = clientCommands.get(clientId) || [];
      if (commands.length > 0) {
        const command = commands.shift();
        clientCommands.set(clientId, commands);
        return c.json({ code: 200, event: "command", data: command });
      }

      const POLL_TIMEOUT = 30000; // 可考虑移到配置文件中

      return new Promise((resolve) => {
        const timeout = setTimeout(() => {
          resolve(c.json({ code: 200, event: "timeout" }));
          cleanup();
        }, POLL_TIMEOUT);

        // 增强的cleanup函数
        const cleanup = () => {
          clearTimeout(timeout);
          clearInterval(heartbeatInterval);
          removePendingRequest(clientId, resolve);
          c.req.raw.socket?.removeListener("close", cleanup);
          c.req.raw.socket?.removeListener("end", cleanup);
          c.req.raw.socket?.removeListener("error", cleanup);
        };

        // 心跳检测
        let lastActivity = Date.now();
        const heartbeatInterval = setInterval(() => {
          if (Date.now() - lastActivity > POLL_TIMEOUT / 2) {
            cleanup();
            resolve(c.json({ code: 200, event: "timeout" }));
          }
        }, 5000);

        // 事件监听
        c.req.raw.socket?.on("close", cleanup);
        c.req.raw.socket?.on("end", cleanup);
        c.req.raw.socket?.on("error", cleanup);

        // 存储请求
        const requestEntry = {
          clientId,
          resolve: (command: any) => {
            lastActivity = Date.now();
            cleanup();
            resolve(c.json({ code: 200, event: "command", data: command }));
          },
          timeout,
          createdAt: Date.now(),
        };

        pendingRequests.set(clientId, [...existingRequests, requestEntry]);
      });
    } catch (error) {
      console.error(`Polling error for client ${clientId}:`, {
        error: error instanceof Error ? error.stack : error,
        clientId,
        timestamp: new Date().toISOString(),
      });
      return c.json({ code: 5001, message: "Internal server error" }, 500);
    }
  })
  .post("/push-command", async (c) => {
    const { clientId, command } = await c.req.json();

    if (!clientId || !command) return c.json({ error: "Invalid params" });

    // 优先唤醒挂起的长轮询请求
    const requests = pendingRequests.get(clientId) || [];
    if (requests.length > 0) {
      const req = requests.shift();
      req?.resolve(command);
      return c.json({ success: true });
    }

    // 无挂起请求时存储指令
    if (!clientCommands.has(clientId)) {
      clientCommands.set(clientId, []);
    }
    clientCommands.get(clientId)?.push(command);
    return c.json({ success: true });
  });

// 清理挂起请求
function removePendingRequest(clientId: string, resolve: () => void) {
  const requests = pendingRequests.get(clientId) || [];
  const index = requests.findIndex((req) => req.resolve === resolve);
  if (index !== -1) requests.splice(index, 1);
  if (requests.length === 0) pendingRequests.delete(clientId);
}

export default app;
