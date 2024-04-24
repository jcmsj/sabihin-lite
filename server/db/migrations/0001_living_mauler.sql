ALTER TABLE "secrets" ADD COLUMN "domain_signature" text NOT NULL;--> statement-breakpoint
ALTER TABLE "secrets" DROP COLUMN IF EXISTS "nonce";