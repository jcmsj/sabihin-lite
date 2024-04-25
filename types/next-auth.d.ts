// https://next-auth.js.org/getting-started/typescript
import { DefaultSession, DefaultUser } from 'next-auth'
import { DefaultJWT } from 'next-auth/jwt'

declare module "next-auth" {
    export interface JWT extends Omit<DefaultJWT, 'email'|'picture'> {
        id?:number
    }
    export interface User extends DefaultUser {
        name:string
        id:number
    }

    export interface Session extends DefaultSession {
        user?: User
    }
  }
