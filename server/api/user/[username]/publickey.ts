import { eq } from "drizzle-orm"
import { db, tables } from "~/server/db"

function getPublicKey(username: string) {
    return db.select({
        publicKey: tables.secrets.publicKey,
    }).from(tables.secrets)
        .leftJoin(tables.users, eq(tables.secrets.userId, tables.users.id))
        .where(eq(tables.users.userName, username)).then(takeUniqueOrThrow)
}

export default eventHandler(async (event) => {
    const username = getRouterParam(event, "username")

    if (username === undefined) {
        throw createError({
            status: 400,
            message: "Missing username",
        })
    }
            
    const result = await getPublicKey(username)
    return result
})
