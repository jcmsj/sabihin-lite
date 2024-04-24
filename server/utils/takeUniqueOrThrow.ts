
/**
 * Example usage:
 * ```ts
 * const record = db.select().from(records)
 *    .where(eq(records.id, 1))
 *    .limit(1).then(takeUniqueOrThrow)
 * ```
 * Note: Unusable for subqueries, since using then() executes the query.
 */
export const takeUniqueOrThrow = <T>(values: T[]): T => {
    if (values.length !== 1)
      throw new Error("Found non unique or inexistent value");
    return values[0]!;
  };
