import { derive, deriveNew } from "./cryptography/masterkey";

function parseSalt(salt:string): Uint8Array {
    // 
    const raw:Record<string, number> = JSON.parse(salt)
    return Uint8Array.from(Object.entries(raw).map(([k, v]) => v))
}

export async function login(username: string, password: string, domain: string) {
    // get salt
    const rawSalt = await $fetch(`/api/salt/${username}`)
    console.log(rawSalt)
    const masterKey = await derive(
        password, 
        parseSalt(rawSalt)
    )
    // sign domain
    const domainSignature = await masterKey.encryptoToHex(domain)
    console.log(domainSignature)
    const { signIn } = useAuth()
    const r = await signIn("credentials", {
        username: username,
        domainSignature,
    })
}
