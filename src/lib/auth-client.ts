import { env } from "@/env";

import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  /** the base url of the server (optional if you're using the same domain) */
  baseURL: env.NEXT_PUBLIC_APP_URL,
});
