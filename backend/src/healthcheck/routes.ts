import { db } from '@app/db';
import { Router } from 'express';

export const router = Router();

router.all('/', async (_req, res) => {
  try {
    const queryResult = await db.query('SELECT 1 as result;');
    if(queryResult.rowCount > 0 && queryResult.rows[0].result === 1) {
      res.status(204).end();
      return;
    }
    res.status(500).end();
  } catch (e) {
    res.status(503).end();
    return;
  }
});
