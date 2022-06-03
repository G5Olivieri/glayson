CREATE TABLE IF NOT EXISTS fixed_expenses (
	id uuid NOT NULL DEFAULT uuid_generate_v4(),
	group_id uuid NOT NULL DEFAULT uuid_generate_v4(),
	name text NOT NULL,
	amount integer NOT NULL,
	start date NOT NULL,
	"end" date,
	owner_id uuid NOT NULL,
	created_at timestamp with time zone DEFAULT now(),
	PRIMARY KEY (id),
	CONSTRAINT fk_account
	FOREIGN KEY(owner_id)
	REFERENCES accounts(id)
)

DROP TABLE IF EXISTS fixed_expenses;
