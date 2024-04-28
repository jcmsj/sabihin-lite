import { asc, eq } from "drizzle-orm";
import { getToken } from "#auth";
import { db } from "~/server/db";
import { inboxes, users } from "~/server/db/schema";


async function getMessages(id: number, page: number, pageSize: number) {
    return await db
        .select()
        .from(inboxes)
        .where(eq(inboxes.userId, id))
        .limit(pageSize) // the number of rows to return
        .offset(page); // the number of rows to skip
}
export default eventHandler(async (event) => {
    const jwt = await getToken({event})
    const {page, pageSize} = getQuery<{page:number,pageSize:number}>(event)
    console.log({jwt, page, pageSize})
    const result = await getMessages(jwt.id, page, pageSize)
    // console.log({result, page, pageSize})
    // return result
    return result
})
