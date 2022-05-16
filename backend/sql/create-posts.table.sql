CREATE TABLE IF NOT EXISTS "posts"(
	"id" uuid DEFAULT uuid_generate_v4(),
	"text" text NOT NULL,
	"author_id" uuid NOT NULL,
	"created_at" timestamp with time zone DEFAULT NOW(),
	PRIMARY KEY ("id"),
	CONSTRAINT "fk_account"
		FOREIGN KEY("author_id")
		REFERENCES "accounts"("id")
);

DROP TABLE IF EXISTS "posts";
