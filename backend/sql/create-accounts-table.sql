/* up */
CREATE TABLE IF NOT EXISTS "accounts" (
	"id" uuid DEFAULT uuid_generate_v4(),
	"username" text NOT NULL UNIQUE,
	"password" text NOT NULL,
	PRIMARY KEY("id")
);

/* down */
DROP TABLE IF EXISTS "accounts";
