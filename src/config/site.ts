import { env } from "@/env";

export type SiteConfig = typeof siteConfig;

export const siteConfig = {
  name: "Cookie Run Kingdom",
  description:
    "Shadcn table with server side sorting, pagination, and filtering",
  url:
    env.NODE_ENV === "development"
      ? "http://localhost:3000"
      : "https://table.sadmn.com",
  links: { github: "https://github.com/sunnng/scy-next-start" },
};
