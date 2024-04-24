import { serial, text, timestamp, pgTable, pgEnum } from "drizzle-orm/pg-core"
export const UserRoleEnum = pgEnum("role", ["user"])

function requiredTimestamp(column_name: string) {
    return timestamp(column_name).defaultNow().notNull()
}
export const users = pgTable("user", {
    id: serial("id").primaryKey(),
    userName: text("user_name").notNull(),
    role: UserRoleEnum('role').notNull(),
    // email: text("email").notNull(),
    createdAt: requiredTimestamp("created_at"),
    updatedAt: requiredTimestamp("updated_at"),
})

export const secrets = pgTable("secrets", {
    id: serial("id").primaryKey(),
    userId: serial('userId')
        .references(() => users.id),
    publicKey: text("public_key").notNull(),
    privateKey: text("private_key").notNull(),
    salt: text("salt").notNull(),
    createdAt: requiredTimestamp("created_at"),
    domainSignature: text("domain_signature").notNull(),
})
export const inboxes = pgTable("inbox", {
    id: serial("id").primaryKey(),
    userId: serial('userId')
        .references(() => users.id),
    message: text("message").notNull(),
    createdAt: requiredTimestamp("created_at"),
    updatedAt: requiredTimestamp("updated_at"),
})
