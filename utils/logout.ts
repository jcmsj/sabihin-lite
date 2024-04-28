const {signOut} = useAuth()
export async function logout(options?:Parameters<typeof signOut>[0]) {
    // remove the token from local storage
    localStorage.removeItem("masterKey")
    await signOut(options)
}
