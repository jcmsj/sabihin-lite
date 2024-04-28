import { count, eq } from "drizzle-orm";
import { db, tables } from "~/server/db";
import { getToken } from "#auth";
// counts the number of messages for a user
export async function countMessages(id: number) {
    return await db
        .select({
            count: count(tables.inboxes.id),
        })
        .from(tables.inboxes)
        .where(eq(tables.inboxes.userId, id))
        .then(takeUniqueOrThrow)
}

export default eventHandler(async (event) => {
    const jwt = await getToken({ event })
    const result = await countMessages(jwt.id)
    return result
})
