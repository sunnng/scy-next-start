import type { AppType } from "@/app/api/hono/[[...route]]/route";
import { env } from "@/env";

import { hc } from "hono/client";

export const client = hc<AppType>(env.NEXT_PUBLIC_APP_URL);
