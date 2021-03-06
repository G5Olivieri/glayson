CREATE TABLE IF NOT EXISTS expenses(
    id uuid DEFAULT uuid_generate_v4(),
    name text NOT NULL,
    amount bigint NOT NULL,
    date date NOT NULL,
    paid boolean DEFAULT FALSE,
    owner_id uuid NOT NULL,
    created_at timestamp with time zone DEFAULT now(),
    PRIMARY KEY (id),
    CONSTRAINT fk_account
    FOREIGN KEY(owner_id)
    REFERENCES accounts(id)
);

ALTER TABLE expenses ADD COLUMN group_id uuid;
ALTER TABLE expenses ADD COLUMN cancelled bool DEFAULT false;

DROP TABLE IF EXISTS expenses;
