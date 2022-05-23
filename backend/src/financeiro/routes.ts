import { ajv } from '@app/ajv';
import { authorize } from '@app/auth/authorize';
import { getAccountFromReq } from '@app/auth/get-account-from-req';
import { db } from '@app/db';
import { handlePromiseExpress } from '@app/handlePromiseExpress';
import { Static, Type } from '@sinclair/typebox';
import { Router } from 'express';
import { parseISO, add } from 'date-fns';

const router = Router();

const createTransactionSchema = Type.Object({
  name: Type.String(),
  date: Type.String({ format: 'date' }),
  amount: Type.Number(),
  paid: Type.Boolean(),
  amountOfSplits: Type.Number({ minimum: 0 })
});

type CreateTransactionType = Static<typeof createTransactionSchema>;

const updateTransactionSchema = Type.Object({
  name: Type.String(),
  date: Type.String({ format: 'date' }),
  amount: Type.Number(),
  paid: Type.Boolean(),
});

type UpdateTransactionType = Static<typeof updateTransactionSchema>;

const splitTransactions = ({ name, date, amount, paid, amountOfSplits }: CreateTransactionType, accountId: string) => {
  if (amountOfSplits == 0) {
    return [[name, date, amount, paid, accountId]];
  }

  const result = [];
  for (let i = 1; i <= amountOfSplits; i++) {
    result.push([`${name} ${i}/${amountOfSplits}`, add(parseISO(date), { months: i-1 }), amount, paid, accountId]);
  }
  return result;
};

router.post('/transactions', authorize, handlePromiseExpress(async (req, res) => {
  const account = getAccountFromReq(req);

  const isValid = ajv.validate<CreateTransactionType>(createTransactionSchema, req.body);
  if (!isValid) {
    return res.status(400).end();
  }

  const transactions = splitTransactions(req.body, account.id);
  const values = [];
  let counter = 1;

  for(let i = 0; i < transactions.length; i++) {
    values.push(`($${counter++}, $${counter++}, $${counter++}, $${counter++}, $${counter++})`);
  }

  const queryResult = await db.query(`
  INSERT INTO
    transactions(name, date, amount, paid, owner_id)
  VALUES
  ${values.join(',')}
  RETURNING
      id, name, date, amount, paid, created_at
  `, transactions.flat());

  return res.send(queryResult.rows).end();
}));

router.get('/transactions', authorize, handlePromiseExpress(async (req, res) => {
  if (req.query.month === undefined
    || (
      typeof req.query.month !== 'string'
      || !(/^\d{4}-\d{2}$/.test(req.query.month)) // 2022-05
    )
  ) {
    return res.status(400).end();
  }
  const account = getAccountFromReq(req);
  const [year, month] = req.query.month.split('-') as [string, string];

  const queryResult = await db.query('SELECT * FROM transactions WHERE owner_id=$1 AND EXTRACT(YEAR FROM date)=$2 AND EXTRACT(MONTH FROM date)=$3', [account.id, year, month]);

  res.send(queryResult.rows).end();
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

  const isValid = ajv.validate<UpdateTransactionType>(updateTransactionSchema, req.body);
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
    [name, date, amount, paid, req.params.id, account.id]);

  if (queryResult.rowCount === 0) {
    return res.status(404).end();
  }

  return res.status(204).end();
}));

export { router };
