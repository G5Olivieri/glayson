DELETE FROM "invalid_tokens" WHERE "created_at" < NOW() - INTERVAL '1 DAY';
