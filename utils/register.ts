import { encodeBase64 } from "hash-wasm/lib/util";
import { randomKeyPair } from "./cryptography/keypair";
import { deriveNew } from "./cryptography/masterkey";
export async function register(userName: string, password: string, domain: string) {
    // Sign up logic
    const masterKey = await deriveNew(password);

    // make keypair
    const keypair = await randomKeyPair();
    //TODO: Store masterKey in localStorage
    // sign domain
    const domainSignature = await masterKey.encryptoToHex(domain)
    // TODO: store keypair in localStorage
    const encryptedPrivateKey = await masterKey.wrapKey("jwk", keypair.privateKey)
    // to str
    const jwkEncryptedPrivateKey = encodeBase64(new Uint8Array(encryptedPrivateKey))
    // const jwkEncryptedPrivateKey = new TextDecoder().decode(encryptedPrivateKey)
    const jsonPublickey = await crypto.subtle.exportKey("jwk", keypair.publicKey)
    const r = await $fetch("/api/register", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: {
            userName,
            salt: masterKey.salt,
            domainSignature,
            publicKey: jsonPublickey,
            jwkEncryptedPrivateKey,
        }
    },
    )
}
