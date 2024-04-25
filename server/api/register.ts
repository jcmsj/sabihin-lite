import { db, tables } from "../db";

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
    }).then(takeUniqueOrThrow);

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
