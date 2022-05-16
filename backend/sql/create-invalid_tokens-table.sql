CREATE TABLE IF NOT EXISTS "invalid_tokens"(
	"id" uuid DEFAULT uuid_generate_v4(),
	"access_token" text NOT NULL,
	"created_at" timestamp DEFAULT NOW(),
	PRIMARY KEY ("id")
);

DROP TABLE IF EXISTS "invalid_tokens";
