import {argon2id} from "hash-wasm"

export interface MasterKey {
    key: CryptoKey
    salt: Uint8Array
    encrypt(msg: string): Promise<ArrayBuffer>
    decrypt(msg: string): Promise<ArrayBuffer>
    encryptBuffer(msg: ArrayBuffer): Promise<ArrayBuffer>
    decryptBuffer(msg: ArrayBuffer): Promise<ArrayBuffer>
    wrapKey(format: KeyFormat, toWrap: CryptoKey): Promise<ArrayBuffer>
    encryptoToHex(msg: string): Promise<string>
}

export const USAGES: KeyUsage[] = ["decrypt", "wrapKey", "unwrapKey", "encrypt"]

export async function derive(
    password: string, 
    salt: Uint8Array, 
): Promise<MasterKey> {
    const textEncoder = new TextEncoder()
    const passwordBuffer = textEncoder.encode(password)
    const saltBuffer = await crypto.subtle.digest("SHA-256", salt)
    // hash salted password w/ argon2id
    const hashedSaltedPassword = await argon2id({
        password: passwordBuffer,
        hashLength: 512, // 512 bits
        iterations: 16,
        outputType: "binary",
        parallelism: 1,
        salt,
        memorySize: 1024, //use 1MB
    })

    // treat hashed salted password as an ECDH key
    const passwordKey = await crypto.subtle.importKey("raw", hashedSaltedPassword, "PBKDF2", false, ["deriveKey"])
    const masterKey = await crypto.subtle.deriveKey(
        {
            name: "PBKDF2",
            salt: saltBuffer,
            iterations: 100_000,
            hash: "SHA-256",
        },
        passwordKey,
        { name: "AES-GCM", length: 256 },
        true,
        USAGES,
    );

    const o:MasterKey = { 
        key: masterKey, 
        salt,
        async encrypt(msg) {
            const msgBuffer = new TextEncoder().encode(msg);
            return await this.encryptBuffer(msgBuffer)
        },
        async decrypt(secret) {
            const msgBuffer = new TextEncoder().encode(secret);
            return await this.decryptBuffer(msgBuffer)
        },
        async encryptBuffer(msg) {
            return await crypto.subtle.encrypt({
                name: "AES-GCM",
                length: 256,
                iv: salt,
            }, masterKey, msg)
        },
        async decryptBuffer(secret) {
            return await crypto.subtle.decrypt({
                name: "AES-GCM",
                length: 256,
                iv: salt,
            }, masterKey, secret)
        },

        /**
         * @see https://developer.mozilla.org/en-US/docs/Web/API/crypto.subtleCrypto/wrapKey
         */
        async wrapKey(format:KeyFormat, toWrap: CryptoKey) {
            return await crypto.subtle.wrapKey(
                format, 
                toWrap, 
                this.key, 
                { 
                    name: "AES-GCM", 
                    length: 256, 
                    iv: salt
                }
            )
        },
        async encryptoToHex(msg: string) {
            const msgBuffer = new TextEncoder().encode(msg);
            const encrypted = await this.encryptBuffer(msgBuffer);
            return Array.from(new Uint8Array(encrypted)).map(x => x.toString(16).padStart(2, '0')).join('')
        }
     }

     return o
}
export async function deriveFromIterables(password: string, salt: Iterable<number>, nonce: Iterable<number>) {
    return derive(password,
        Uint8Array.from(salt),
    )
}
export async function deriveNew(password: string): Promise<MasterKey> {
    const salt = crypto.getRandomValues(new Uint8Array(16));
    return await derive(password, salt);
}

export async function wrapWithMasterKey({ key }: MasterKey, toWrap: CryptoKey): Promise<ArrayBuffer> {
    return await crypto.subtle.wrapKey("jwk", toWrap, key, { name: "AES-GCM" });
}
