import { Hono } from "hono";
import { handle } from "hono/vercel";

import client from "@/features/client/server/route";

export const runtime = "nodejs";

const app = new Hono().basePath("/api/hono");

const _route = app.route("client", client);

export const GET = handle(app);
export const POST = handle(app);

export type AppType = typeof _route;
