import { Client } from 'pg';

const getConnection = () => {
  const connectionString = process.env.DATABASE_URL;
  if (connectionString) {
    return new Client({
      connectionString
    });
  }
  return new Client();
};

export const db = getConnection();
