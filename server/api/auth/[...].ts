// file: ~/server/api/auth/[...].ts
import CredentialsProvider from 'next-auth/providers/credentials'
import { NuxtAuthHandler } from '#auth'
import { db, tables } from '~/server/db'
import { and, eq } from 'drizzle-orm'
import { takeUniqueOrThrow } from '~/server/utils/takeUniqueOrThrow'
import * as auth from '~/server/utils/auth'
async function getUser(userId: number) {
    return db.select().from(tables.users)
        .where(and(
            eq(tables.users.id, userId), 
            eq(tables.users.role, 'user')
        ))
        .limit(1).then(takeUniqueOrThrow)
}
async function getSecret(username: string) {
    return db.select().from(tables.secrets)
    .leftJoin(tables.users, eq(tables.users.id, tables.secrets.userId))
        .where(eq(tables.secrets.userId, tables.users.id))
        .limit(1).then(takeUniqueOrThrow)
}

export default NuxtAuthHandler({
    // A secret string you define, to ensure correct encryption
    //secret: process.env.AUTH_SECRET, // UNSURE IF THIS IS STILL NEEDED
    providers: [
        // @ts-expect-error You need to use .default here for it to work during SSR. May be fixed via Vite at some point
        CredentialsProvider.default({
            // The name to display on the sign in form (e.g. 'Sign in with...')
            name: 'Credentials',
            // The credentials is used to generate a suitable form on the sign in page.
            // You can specify whatever fields you are expecting to be submitted.
            // e.g. domain, username, password, 2FA token, etc.
            // You can pass any HTML attribute to the <input> tag through the object.
            credentials: {
                username: { label: 'Username', type: 'text', placeholder: '(hint: chani)' },
                password: { label: 'Password', type: 'password', placeholder: '(hint: Sihaya )' }
            },
            async authorize(credentials: auth.LoginProps) {
                const expectedCredentials = await getSecret(credentials.username)
                // const authenticated = await auth.authenticate(credentials, expectedCredentials)
                const authenticated = true
                if (authenticated) {
                    // return getUser(authenticated)
                    // Any object returned will be saved in `user` property of the JWT
                } else {
                    // eslint-disable-next-line no-console
                    console.error('Warning: Malicious login attempt registered, bad credentials provided')
                    throw createError({
                        statusCode: 401,
                        statusMessage: 'Invalid credentials'
                    })
                }
            }
        })
    ]
})
