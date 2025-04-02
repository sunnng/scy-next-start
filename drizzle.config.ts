import type { Config } from "drizzle-kit";

import { env } from "@/env";
import { databasePrefix } from "@/lib/constants";

export default {
  schema: "./src/db/schema.ts",
  dialect: "mysql",
  dbCredentials: {
    url: env.DATABASE_URL,
  },
  tablesFilter: [`${databasePrefix}_*`],
} satisfies Config;
