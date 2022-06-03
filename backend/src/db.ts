import { Pool } from 'pg';

const getConnection = () => {
  const connectionString = process.env.DATABASE_URL;
  if (connectionString) {
    return new Pool({
      connectionString,
      ssl: {
        rejectUnauthorized: false,
      }
    });
  }
  return new Pool();
};

export const db = getConnection();
