import { db, tables } from "../db";

const UNIQUE_CONSTRAINT_ERROR = "23505"
async function registerUser(data: {
    userName:string, 
    domainSignature:string, 
    publicKey: string, 
    jwkEncryptedPrivateKey: string,
    salt: string
}) {
    const user = await db.insert(tables.users).values({
        role: "user",
        userName: data.userName,
    }).returning({
        id: tables.users.id,
    }).then(takeUniqueOrThrow).catch(error => {
        if (error.code == UNIQUE_CONSTRAINT_ERROR) {
            throw createError({
                statusCode: 409,
                statusMessage: "Username already exists"
            })
        }
        // else throw it again
        throw error;
    });

    const secret = db.insert(tables.secrets).values({
        privateKey: data.jwkEncryptedPrivateKey,
        publicKey: data.publicKey,
        userId: user.id,
        salt: data.salt,
        domainSignature: data.domainSignature,
    })

    return secret;
}

export default eventHandler(async(event) => {
    const body = await readBody<{
        userName: string;
        salt: string;
        domainSignature: string;
        jwkEncryptedPrivateKey: string;
        publicKey: string;
    }>(event);

    console.log(body)
    const result = await registerUser(body)
    return true;
})
