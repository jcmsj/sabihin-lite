import { eq, sql } from "drizzle-orm"
import { db, tables } from "~/server/db"
import { users } from "~/server/db/schema"

function insertMessage(username: string, message: string) {
    return db.insert(tables.inboxes).values({
        message,
        userId: sql<number>`(SELECT ${users.id} FROM ${users} WHERE ${users.userName} = ${username})`
            .mapWith(Number),
    }).returning({
        id: tables.inboxes.id,
    }).then(takeUniqueOrThrow)
}
export default eventHandler(async (event) => {
    const username = getRouterParam(event, "username")

    if (username === undefined) {
        throw createError({
            status: 400,
            message: "Missing username",
        })
    }

    const {message} = await readBody<{message: string}>(event)
    const result = await insertMessage(username, message)
    return result
})
