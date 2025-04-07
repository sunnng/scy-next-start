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
    console.log(clientLastSeen);
    return c.json({
      status: "ok",
    });
  })
  // 长轮询接口
  .post("/poll", async (c) => {
    const clientId = c.req.header("x-client-id");
    if (!clientId) {
      return c.json(
        {
          message: "no clientId",
        },
        400
      );
    }

    // 检查是否有待发送指令
    const commands = clientCommands.get(clientId) || [];
    if (commands.length > 0) {
      const command = commands.shift();
      clientCommands.set(clientId, commands);

      return c.json({
        command,
      });
    }

    // 无指令时挂起请求（最长等待 30 秒）
    return new Promise((promiseResolve) => {
      const timeout = setTimeout(() => {
        c.json({ event: "timeout" });
        removePendingRequest(clientId, promiseResolve);
      }, 30000);

      // 存储挂起请求
      if (!pendingRequests.has(clientId)) {
        pendingRequests.set(clientId, []);
      }
      pendingRequests.get(clientId)?.push({
        clientId,
        resolve: (command) => {
          clearTimeout(timeout);
          promiseResolve(c.json({ command }));
          removePendingRequest(clientId, promiseResolve);
        },
        timeout,
      });
    });
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
function removePendingRequest(clientId: string, resolve: Function) {
  const requests = pendingRequests.get(clientId) || [];
  const index = requests.findIndex((req) => req.resolve === resolve);
  if (index !== -1) requests.splice(index, 1);
  if (requests.length === 0) pendingRequests.delete(clientId);
}

export default app;
