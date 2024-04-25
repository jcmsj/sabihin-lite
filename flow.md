## Registration Flow
1. User inputs:
    1. `userName`
    2. `password`
    3. `domain` - defaults to `sabihin.lite.ph`

2. Client-side:
    1. Verify that the `userName` is not yet registered. (TODO)
    2. Password strength must score at least 1 using ZXCVBN.
    3. Do [Master key creation](#master-key-creation)
    4. Do [Keypair derivation](#keypair-derivation)
    5. Store the derived master key in localStorage. (TODO)
    6. Sign the `domain` using the `master key`.
    7. Store the key pair in localStorage. (TODO)
    8. Encrypt the private key from the key pair using the derived master key with the `wrapKey` function.
    9. Encode the encrypted private key to Base64.
    10. Export the public key from the key pair to JSON Web Key (JWK) format.

3. Send a POST request to the `/api/register` endpoint with the following body:
    1. `userName`
    2. salt
    3. Signed domain
    4. public key in JWK form
    5. Base64 encoded encrypted private key

### Master Key Derivation
1. inputs: 
    1. `password`
    2. `salt`
3. append password to salt
5. hash salted password w/ `argon2id`
7. Create a 256-bit `AES-GCM` key using `PKDF2` with the hashed salted password as input
8. return
    1. `master key`
    2. `salt`

### Master key Creation
1. input `password`
2. make random `salt`
3. Do [Master key derivation](#master-key-derivation)

### Keypair derivation
1. input: `master key`
2. generate an ECDH keypair
3. encrypt the private key using the master key
4. return the public key and the encrypted private key

## Login Flow
1. input: 
    1. `username`
    2. `password`
3. get the `salt` of the corresponding `username` from the server
3. Do [Master key derivation](#master-key-derivation)
4. sign domain w/ master key
5. submit 
    1. `username`
    2. `signed domain`
6. Server side:
    1. get the signature belonging to the `username`
    2. check if domain signature is equal to the one in the DB.
    3. if it does:
        * return the `keypair`
    4. else:
        * return an error
7. Check server response
    1. if keypair is returned:
        1. decrypt encrypted public key using master key
        2. persist decrypted public key in device for future use
        3. Note: if decryption fails:
            1. the signature was stolen
            2. or the master key is wrong
            3. Could mean an attack essentially
    2. else:
        1. display error messages

## Sending Messages Flow
1. input: recipient's `username`, `message`
2. Fetch recipient's `public key`
3. Encrypt the `message` using the recipient's `public key`
4. Submit: 
    1. recipient's `username`
    2. encrypted message

## Reading Messages Flow
1. input:
    1. encrypted message/s
    2. user's `private key`
2. Decrypt the messages using the user's `private key`
3. Display the messages

