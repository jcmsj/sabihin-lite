import { encodeBase64 } from "hash-wasm/lib/util";

// https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto/generateKey#aes_key_generation
export async function randomKeyPair(): Promise<CryptoKeyPair> {
  return await crypto.subtle.generateKey(
    {
      name: "RSA-OAEP",
      modulusLength: 4096,
      publicExponent: new Uint8Array([1, 0, 1]),
      hash: "SHA-256",
    },
    true,
    ["encrypt", "decrypt", "unwrapKey", "wrapKey"],
  );
}

export class PublicKey {
  static deserialize(publicKey: string) {
    const jwk = JSON.parse(publicKey);
    return crypto.subtle.importKey(
      "jwk",
      jwk,
      {
        name: "RSA-OAEP",
        hash: "SHA-256",
      },
      true,
      ["encrypt", "wrapKey"]);
  }
  static async serialize(publicKey: CryptoKey) {
    return encodeBase64(new Uint8Array(await crypto.subtle.exportKey("raw", publicKey)))
  }
}

export function encrypt(publicKey: CryptoKey, data: string): Promise<ArrayBuffer> {
  return crypto.subtle.encrypt(
    {
      name: "RSA-OAEP",
    },
    publicKey,
    new TextEncoder().encode(data),
  );
}

export function decrypt(privateKey: CryptoKey, data: ArrayBuffer): Promise<string> {
  return crypto.subtle.decrypt(
    {
      name: "RSA-OAEP",
    },
    privateKey,
    data,
  ).then((decrypted) => new TextDecoder().decode(decrypted));
}
