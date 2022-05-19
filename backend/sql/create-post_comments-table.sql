CREATE TABLE IF NOT EXISTS post_comments (
    id uuid DEFAULT uuid_generate_v4(),
    text text NOT NULL,
    author_id uuid NOT NULL,
    post_id uuid NOT NULL,
    created_at timestamp with time zone DEFAULT now(),
    PRIMARY KEY (id),
    CONSTRAINT fk_account
    FOREIGN KEY(author_id)
    REFERENCES accounts(id),
    CONSTRAINT fk_post
    FOREIGN KEY(post_id)
    REFERENCES posts(id)
);

DROP TABLE IF EXISTS post_comments;
