import { getServerSession } from '#auth'
import { eq } from 'drizzle-orm'
import { db, tables } from '~/server/db'
function getEncryptedPrivateKey(id:number) {
    return db.select({
        privateKey: tables.secrets.privateKey,
    }).from(tables.secrets)
        .leftJoin(tables.users, eq(tables.secrets.userId, tables.users.id))
        .where(
            eq(tables.secrets.userId, id))
        .limit(1).then(takeUniqueOrThrow)
}
export default eventHandler(async(event) => {
    const session = await getServerSession(event)
    if (session == null || session.user == null) {
        throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
    }
    const result = await getEncryptedPrivateKey(session.user.id)

    return result
    // return session
})
