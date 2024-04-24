/** Convenience functions for cryptography w/ the Web Crypto API. */

async function computeSaltBuffer(salt: Uint8Array): Promise<ArrayBuffer> {
    const textEncoder = new TextEncoder();

    const saltBuffer = new Uint8Array(256);
    textEncoder.encodeInto("sabihin.ph", saltBuffer);
    for (let index = 10; index < 240; index++) {
        saltBuffer[index] = "L".charCodeAt(0);
    }

    for (let index = 0; index < 16; index++) {
        saltBuffer[index + 240] = salt[index];
    }

    return await crypto.subtle.digest("SHA-256", saltBuffer);
}

// TODO
//
// define interface for master key
// define interface for public/private keys
// define interface for ephemeral key

export namespace MasterKey {
    export type MasterKey = {
        key: CryptoKey,
        salt: Uint8Array,
        nonce: Uint8Array,
    }

    export const USAGES: KeyUsage[] = ["decrypt", "wrapKey", "unwrapKey"];
    export async function derive(password: string, salt: Uint8Array, nonce: Uint8Array): Promise<MasterKey> {
        const textEncoder = new TextEncoder();
        const passwordBuffer = textEncoder.encode(password);
        const saltBuffer = await crypto.subtle.digest("SHA-256", salt)
        const passwordKey = await crypto.subtle.importKey("raw", passwordBuffer, "PBKDF2", false, ["deriveKey"]);
        const key = await crypto.subtle.deriveKey(
            {
                "name": "PBKDF2",
                "salt": saltBuffer,
                "iterations": 100_000,
                "hash": "SHA-256",
            },
            passwordKey,
            { "name": "AES-GCM", "length": 256 },
            true,
            USAGES,
        );
        
        return { key, salt, nonce };
    }
    export async function deriveFromIterables(password: string, salt: Iterable<number>, nonce: Iterable<number>) {
        return derive(password,
            Uint8Array.from(salt),
            Uint8Array.from(nonce),
        )
    }
    export async function deriveNew(password: string): Promise<MasterKey> {
        const salt = crypto.getRandomValues(new Uint8Array(16));
        const nonce = crypto.getRandomValues(new Uint8Array(16));
        return await derive(password, salt, nonce);
    }

    export async function wrapWithMasterKey({ key, nonce }: MasterKey, toWrap: CryptoKey): Promise<ArrayBuffer> {
        return await crypto.subtle.wrapKey("jwk", toWrap, key, { "name": "AES-GCM", "iv": nonce });
    }
}

export namespace WrappingKeys {
    export const USAGES: KeyUsage[] = ["wrapKey", "unwrapKey"];
    export const NAME = "RSA-OAEP";

    export async function randomWrappingKeys(): Promise<CryptoKeyPair> {
        return await crypto.subtle.generateKey(
            {
                name: NAME,
                "modulusLength": 4096,
                "publicExponent": new Uint8Array([1, 0, 1]),
                "hash": "SHA-256"
            },
            true,
            USAGES
        );
    }

    export async function wrapWithPublicKey(publicKey: CryptoKey, key: CryptoKey): Promise<ArrayBuffer> {
        return await crypto.subtle.wrapKey("jwk", key, publicKey, { name: NAME });
    }
    export namespace Raw {
        export async function ser(key: CryptoKey) {
            return crypto.subtle.exportKey("raw", key);
        }

        export async function de(publicKey: ArrayBuffer) {
            return crypto.subtle.importKey("raw", publicKey, {
                name: NAME,
            }, true, USAGES);
        }
    }

    export async function unwrapWithMasterKey({ key, nonce }: MasterKey.MasterKey, encryptedKey: ArrayBuffer): Promise<CryptoKey> {
        return await crypto.subtle.unwrapKey("jwk", encryptedKey, key, { "name": "AES-GCM", "iv": nonce }, { name: NAME, "hash": "SHA-256" }, true, ["unwrapKey"]);
    }

    export async function ser(pair: CryptoKeyPair): Promise<string> {
        const privateKey = await crypto.subtle.exportKey("jwk", pair.privateKey);
        const publicKey = await crypto.subtle.exportKey("jwk", pair.publicKey);

        return JSON.stringify({
            privateKey,
            publicKey
        });
    }
    export async function serialize(key: CryptoKey): Promise<string> {
        return JSON.stringify(
            await crypto.subtle.exportKey("jwk", key)
        )
    }
    export async function dePrivate(jwk: JsonWebKey) {
        return crypto.subtle.importKey(
            "jwk",
            jwk,
            {
                name: NAME,
                hash: "SHA-256",
            },
            true,
            ["unwrapKey"]
        );
    }
    export async function dePublic(jwk: JsonWebKey) {
        return crypto.subtle.importKey(
            "jwk",
            jwk,
            {
                name: NAME,
                hash: "SHA-256",
            },
            true,
            ["wrapKey"]
        );
    }
    export async function de(raw: string): Promise<CryptoKeyPair> {
        const { privateKey, publicKey }: {
            privateKey: JsonWebKey,
            publicKey: JsonWebKey,
        } = JSON.parse(raw);

        return {
            privateKey: await dePrivate(privateKey),
            publicKey: await dePublic(publicKey)
        }
    }
}

export namespace EphemeralKey {
    export type EphemeralKey = {
        key: CryptoKey,
        nonce: Uint8Array,
    }
    const USAGES: KeyUsage[] = ["encrypt", "decrypt"]
    export function randomNonce() {
        return crypto.getRandomValues(new Uint8Array(16))
    }
    export async function random(): Promise<EphemeralKey> {
        const key = await crypto.subtle.generateKey({ "name": "AES-GCM", "length": 256 }, true, USAGES);
        return { key, nonce: randomNonce() };
    }

    export async function encrypt({ key, nonce }: EphemeralKey, data: ArrayBuffer): Promise<ArrayBuffer> {
        return await crypto.subtle.encrypt({ "name": "AES-GCM", "iv": nonce }, key, data);
    }

    export async function decrypt({ key, nonce }: EphemeralKey, data: ArrayBuffer): Promise<ArrayBuffer> {
        return await crypto.subtle.decrypt({ "name": "AES-GCM", "iv": nonce }, key, data);
    }

    export async function ser(e: EphemeralKey) {
        return crypto.subtle.exportKey("jwk", e.key)
    }
    export async function unwrapWithPrivateKey(privateKey: CryptoKey, ephemeralKey: ArrayBuffer): Promise<CryptoKey> {
        return await crypto.subtle.unwrapKey("jwk", ephemeralKey, privateKey, { "name": "RSA-OAEP" }, { "name": "AES-GCM", "length": 256 }, true, USAGES);
    }
}

export namespace AuthKey {
    export async function derive({ key }: MasterKey.MasterKey) {
        const raw = await crypto.subtle.exportKey("raw", key);
        const half = raw.slice(raw.byteLength / 2, raw.byteLength);
        return crypto.subtle.digest("SHA-256", half);
    }
}
// export namespace AesCbc {
//     export interface KeySaltNonce {
//         key: CryptoKey,
//         salt: Uint8Array,
//         nonce: Uint8Array
//     }

//     export async function randomKeySaltNonce(): Promise<KeySaltNonce> {
//         const key = await crypto.subtle.generateKey({ "name": "AES-CBC", length: 256 }, true, ["encrypt", "decrypt", "wrapKey", "unwrapKey"]);
//         const salt = crypto.getRandomValues(new Uint8Array(16));
//         const nonce = crypto.getRandomValues(new Uint8Array(16));
//         return { key, salt, nonce };
//     }

//     export async function deriveKeySaltNonce(password: string, salt: Uint8Array, nonce: Uint8Array): Promise<KeySaltNonce> {
//         const textEncoder = new TextEncoder();
//         const passwordBuffer = textEncoder.encode(password);
//         const saltBuffer = await computeSaltBuffer(salt);

//         const passwordKey = await crypto.subtle.importKey("raw", passwordBuffer, "PBKDF2", false, ["deriveKey"]);
//         const key = await crypto.subtle.deriveKey(
//             {
//                 "name": "PBKDF2",
//                 "salt": saltBuffer,
//                 "iterations": 100_000,
//                 "hash": "SHA-256",
//             },
//             passwordKey,
//             { "name": "AES-CBC", "length": 256 },
//             true,
//             ["encrypt", "decrypt", "wrapKey", "unwrapKey"],
//         );

//         return { key, salt, nonce };
//     }

//     export async function deriveKeySaltNonceRandom(password: string): Promise<KeySaltNonce> {
//         const salt = crypto.getRandomValues(new Uint8Array(16));
//         const nonce = crypto.getRandomValues(new Uint8Array(16));

//         return await deriveKeySaltNonce(password, salt, nonce);
//     }

//     export async function encrypt({ key, nonce }: KeySaltNonce, data: ArrayBuffer): Promise<ArrayBuffer> {
//         return await crypto.subtle.encrypt({ "name": "AES-CBC", "iv": nonce }, key, data);
//     }

//     export async function decrypt({ key, nonce }: KeySaltNonce, data: ArrayBuffer): Promise<ArrayBuffer> {
//         return await crypto.subtle.decrypt({ "name": "AES-CBC", "iv": nonce }, key, data);
//     }

//     export async function wrapKey({ key, nonce }: KeySaltNonce, toWrap: CryptoKey): Promise<ArrayBuffer> {
//         return await crypto.subtle.wrapKey("jwk", toWrap, key, { "name": "AES-CBC", "iv": nonce });
//     }
// }

// export namespace Ecdh {
//     export async function randomKeyPair(): Promise<CryptoKeyPair> {
//         return await crypto.subtle.generateKey({ "name": "ECDH", "namedCurve": "P-521" }, true, ["deriveKey"]);
//     }

//     export async function deriveSharedSecret(privateKey: CryptoKey, publicKey: CryptoKey): Promise<CryptoKey> {
//         return await crypto.subtle.deriveKey(
//             {
//                 "name": "ECDH",
//                 "public": publicKey
//             },
//             privateKey,
//             {
//                 "name": "AES-CBC",
//                 "length": 256
//             },
//             true,
//             ["encrypt", "decrypt"]
//         );
//     }

//     export async function unwrapKey({ key, nonce }: AesCbc.KeySaltNonce, toUnwrap: ArrayBuffer): Promise<CryptoKey> {
//         return await crypto.subtle.unwrapKey("jwk", toUnwrap, key, { "name": "AES-CBC", "iv": nonce }, { "name": "ECDH", "namedCurve": "P-521" }, true, ["deriveKey"]);
//     }
// }
