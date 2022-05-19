CREATE TABLE IF NOT EXISTS tasks (
    id uuid DEFAULT uuid_generate_v4(),
    name text NOT NULL UNIQUE,
    done boolean NOT NULL DEFAULT FALSE,
    created_at timestamp with time zone DEFAULT now(),
    assigned_to_id uuid NOT NULL,
    PRIMARY KEY(id),
    CONSTRAINT fk_accounts
    FOREIGN KEY(assigned_to_id)
    REFERENCES accounts(id)
);

DROP TABLE IF EXISTS tasks;
