import { derive, deriveNew } from "./cryptography/masterkey";

function parseSalt(salt:string): Uint8Array {
    const raw:Record<string, number> = JSON.parse(salt)
    return Uint8Array.from(Object.entries(raw).map(([k, v]) => v))
}

export async function login(username: string, password: string, domain: string) {
    // get salt
    const rawSalt = await $fetch(`/api/salt/${username}`)
    if (rawSalt === undefined) {
        throw new Error("User not found")
    }
    const masterKey = await derive(
        password, 
        parseSalt(rawSalt)
    )

    localStorage.setItem("masterKey", await masterKey.export())

    // sign domain
    const domainSignature = await masterKey.encryptoToHex(domain)
    const { signIn } = useAuth()
    const r = await signIn("credentials", {
        username,
        domainSignature,
    })
    console.log({r})
}
