async function sendMessage(
    plaintext: string, 
    publicKey: CryptoKey, 
): Promise<{
    ciphertext: ArrayBuffer,
}> {
    // Convert the message to an ArrayBuffer
    const encoder = new TextEncoder();
    const messageBuffer = encoder.encode(plaintext);

    // Generate a random 12-byte initialization vector
    // const iv = crypto.getRandomValues(new Uint8Array(12));
    
    const ciphertext = await crypto.subtle.encrypt({
        name: "ECDH",
    }, publicKey, messageBuffer)

    return {
        ciphertext
    }
}

