export const NAME = "ECDSA";
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
    ["encrypt", "decrypt", "unwrapKey","wrapKey"],
  );
}
