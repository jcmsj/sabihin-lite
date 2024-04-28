// file: ~/server/api/auth/[...].ts
import CredentialsProvider from 'next-auth/providers/credentials'
import { NuxtAuthHandler } from '#auth'
import { db, tables } from '~/server/db'
import { DrizzleError, and, eq } from 'drizzle-orm'
import { takeUniqueOrThrow } from '~/server/utils/takeUniqueOrThrow'
import * as auth from '~/server/utils/auth'

async function getSecret(username: string, domainSignature: string) {
    return await db.select().from(tables.secrets)
        .leftJoin(tables.users, eq(tables.users.id, tables.secrets.userId))
        .where(
            and(
                eq(tables.users.userName, username),
                eq(tables.secrets.domainSignature, domainSignature),
            )
        )
        .limit(1).then(takeUniqueOrThrow)
}

export default NuxtAuthHandler({
    // A secret string you define, to ensure correct encryption
    //secret: process.env.AUTH_SECRET, // UNSURE IF THIS IS STILL NEEDED
    session: {
        strategy: 'jwt',
    },
    pages: {
        signIn:'/login',
    },
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
                domainSignature: { label: 'Domain Signature', type: 'text', placeholder: '(hint: 0x1234)' }
            },

            async authorize(credentials: auth.LoginProps) {
                let result: Awaited<ReturnType<typeof getSecret>> | undefined = undefined;
                try {
                    result = await getSecret(credentials.username, credentials.domainSignature)
                } catch (error) {
                    if (error instanceof DrizzleError) {
                        if (error.message == 'Found non unique or inexistent value') {
                            throw createError({
                                statusCode: 401, 
                                statusMessage: "Invalid username or password"
                            })
                        }
                        throw createError({
                            statusCode: 401,
                            statusMessage: JSON.stringify(error)
                        })
                    } else {
                        throw createError({
                            statusCode: 500, // Internal Server Error
                            statusMessage: JSON.stringify(error)
                        })
                    }
                }

                if (result) {
                    return {
                        id: result.user?.id,
                        encryptedPrivateKey: result.secrets.privateKey,
                        name: result.user?.userName
                    }
                }
            },
        })
    ],

    callbacks: {
        jwt: async ({ token, user }) => {
            const isSignIn = user ? true : false;
            if (isSignIn) {
                token.id = user.id;
                token.name = user.name;
            }
            return token
        },
        async session({ session, token }) {
            // console.log('token: ', token)
            if (token) {
                session.user = {
                    id: token.id as number,
                    name: token.name as string,
                }
            }
            // console.log('session: ', session)
            return Promise.resolve(session)
        },
    }
})
