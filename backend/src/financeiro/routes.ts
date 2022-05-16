import { ajv } from '@app/ajv';
import { authorize } from '@app/auth/authorize';
import { getAccountFromReq } from '@app/auth/get-account-from-req';
import { db } from '@app/db';
import { handlePromiseExpress } from '@app/handlePromiseExpress';
import { Static, Type } from '@sinclair/typebox';
import { Router } from 'express';

const router = Router();

const createTransactionSchema = Type.Object({
  name: Type.String(),
  date: Type.String({ format: 'date' }),
  amount: Type.Number(),
  paid: Type.Boolean(),
});

type CreateTransactionType = Static<typeof createTransactionSchema>;

router.post('/transactions', authorize, handlePromiseExpress(async (req, res) => {
  const account = getAccountFromReq(req);

  const isValid = ajv.validate<CreateTransactionType>(createTransactionSchema, req.body);
  if (!isValid) {
    return res.status(400).end();
  }

  const { name, date, amount, paid } = req.body;

  const queryResult = await db.query(`
  INSERT INTO
    transactions(name, date, amount, paid, owner_id)
  VALUES
    ($1, $2, $3, $4, $5)
  RETURNING
    id, name, date, amount, paid, created_at
  `, [name, date, amount, paid, account.id]);

  return res.send({
    ...queryResult.rows[0]
  }).end();
}));

router.get('/transactions', authorize, handlePromiseExpress(async (req, res) => {
  const account = getAccountFromReq(req);

  const queryResult = await db.query('SELECT * FROM transactions WHERE owner_id=$1 ORDER BY created_at DESC', [account.id]);
  return res.send(queryResult.rows).end();
}));

router.get('/transactions/:id', authorize, handlePromiseExpress(async (req, res) => {
  const account = getAccountFromReq(req);

  const queryResult = await db.query('SELECT * FROM transactions WHERE id=$1 AND owner_id=$2', [req.params.id, account.id]);

  if (queryResult.rowCount === 0) {
    return res.status(404).end();
  }

  return res.send(queryResult.rows[0]).end();
}));

router.delete('/transactions/:id', authorize, handlePromiseExpress(async (req, res) => {
  const account = getAccountFromReq(req);

  const queryResult = await db.query('DELETE FROM transactions WHERE id=$1 AND owner_id=$2', [req.params.id, account.id]);
  if (queryResult.rowCount === 0) {
    return res.status(404).end();
  }
  return res.status(204).end();
}));

router.get('/transactions/:id/pay', authorize, handlePromiseExpress(async (req, res) => {
  const account = getAccountFromReq(req);

  const queryResult = await db.query('UPDATE transactions SET paid=\'TRUE\' WHERE id=$1 AND owner_id=$2', [req.params.id, account.id]);
  if (queryResult.rowCount === 0) {
    return res.status(404).end();
  }
  return res.status(204).end();
}));

router.put('/transactions/:id', authorize, handlePromiseExpress(async (req, res) => {
  const account = getAccountFromReq(req);

  const isValid = ajv.validate<CreateTransactionType>(createTransactionSchema, req.body);
  if (!isValid) {
    return res.status(400).end();
  }

  const { name, date, amount, paid } = req.body;

  const queryResult = await db.query(`
  UPDATE
    transactions
  SET
    name=$1,
    date=$2,
    amount=$3,
    paid=$4
  WHERE
    id=$5 AND owner_id=$6`,
    [ name, date, amount, paid, req.params.id, account.id ]);

  if (queryResult.rowCount === 0) {
    return res.status(404).end();
  }

  return res.status(204).end();
}));

export { router };
