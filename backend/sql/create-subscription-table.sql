/* up */
CREATE TABLE IF NOT EXISTS "subscriptions" (
	"id" uuid DEFAULT uuid_generate_v4(),
	"device" text NOT NULL UNIQUE,
	"owner_id" uuid NOT NULL,
  "subscription" text NOT NULL,
	PRIMARY KEY("id"),
	CONSTRAINT "fk_accounts"
		FOREIGN KEY("owner_id")
		REFERENCES "accounts"("id")
);

/* down */
DROP TABLE IF EXISTS "subscriptions";
