import { DrizzleError, eq } from "drizzle-orm";
import { db, tables } from "~/server/db";
async function getSalt(username: string) {
    return await db.select({
        salt: tables.secrets.salt,
    }).from(tables.secrets)
        .leftJoin(tables.users, eq(tables.users.id, tables.secrets.userId))
        .where(
            eq(tables.users.userName, username)
        )
        .limit(1).then(takeUniqueOrThrow)
}

export default eventHandler(async (event) => {
    const username: string | undefined = getRouterParam(event, 'username')
    if (!username) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Missing username'
        })
    }
    const result = await getSalt(username)
        .catch(error => {
            if (error.message == 'Found non unique or inexistent value') {
                throw createError({
                    statusCode: 401,
                    statusMessage: "Invalid username or password"
                })
            }
            console.log(error.message)
        })
    return result?.salt
})
