// https://next-auth.js.org/getting-started/typescript
import { DefaultSession, DefaultUser } from 'next-auth'
import { DefaultJWT } from 'next-auth/jwt'

declare module "next-auth" {
    export interface JWT extends Omit<DefaultJWT, 'email'|'picture'> {
        id?:string
    }
    export interface User extends DefaultUser {
        name:string
        id:string
    }

    export interface Session extends DefaultSession {
        user?: User
    }
  }
