CREATE EXTENSION IF NOT EXISTS "uuid-ossp"; -- noqa: L057
SELECT uuid_generate_v4();
