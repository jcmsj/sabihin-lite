## Registration Flow
1. Inputs
    1. `username`
    2. `password`

2. Password strength must score at least 1 using ZXCVBN.
3. Verify in server that the username is not taken
4. Do [Master key creation](#master-key-creation)
5. Do [Keypair derivation](#keypair-derivation)
7. ecnrypt keypair using master key
6. sign our domain `sabihin.lite.ph` w/ `master key`
5. submit:
    1. `username`
    2. `encrypted private key`
    3. `public key`
    4. `domain signature`

### Master Key Derivation
1. inputs: 
    1. `password`
    2. `salt`
3. append password to salt
4. treat salted password as an `ECDH` key
5. hash salted password w/ `argon2id`
6. derive the master key from the hash salted password
7. The master key is 256-bit `AES-GCM` key
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
2. Do [Master key derivation](#master-key-derivation)
3. sign domain w/ master key
4. submit 
    1. `username`
    2. `signed domain`
5. Server side:
    1. get the signature belonging to the `username`
    2. check if domain signature is equal to the one in the DB.
    3. if it does:
        * return the `keypair`
    4. else:
        * return an error
6. Check server response
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

