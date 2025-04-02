/**
 * @see https://gist.github.com/rphlmr/0d1722a794ed5a16da0fdf6652902b15
 */
import { databasePrefix } from "@/lib/constants";

import { type AnyColumn, sql } from "drizzle-orm";
import { mysqlTableCreator } from "drizzle-orm/mysql-core";

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const mysqlTable = mysqlTableCreator(
  (name) => `${databasePrefix}_${name}`
);

export function takeFirstOrNull<TData>(data: TData[]) {
  return data[0] ?? null;
}

export function takeFirstOrThrow<TData>(data: TData[], errorMessage?: string) {
  const first = takeFirstOrNull(data);

  if (!first) {
    throw new Error(errorMessage ?? "Item not found");
  }

  return first;
}

export function isEmpty<TColumn extends AnyColumn>(column: TColumn) {
  return sql<boolean>`
    case
      when ${column} is null then true
      when ${column} = '' then true
      when ${column}::text = '[]' then true
      when ${column}::text = '{}' then true
      else false
    end
  `;
}
