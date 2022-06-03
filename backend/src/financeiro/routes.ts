import { ajv } from '@app/ajv';
import { authorize } from '@app/auth/authorize';
import { getAccountFromReq } from '@app/auth/get-account-from-req';
import { db } from '@app/db';
import { handlePromiseExpress } from '@app/handlePromiseExpress';
import { Static, Type } from '@sinclair/typebox';
import { add, format, parseISO } from 'date-fns';
import { Router } from 'express';

const getPreviousMonth = (month: number, year: number) => {
  if (month === 1) {
    return `${year - 1}-12-`;
  }
  return `${year}-${month.toString().padStart(2, '0')}-`;
};

const getJoinedMonth = (month: number, year: number) => {
  return `${year}${(month + 1).toString().padStart(2, '0')}`;
};

type InsertNewFixedExpenseArg = {
  name: string
  amount: number
  date: string
  group_id: string
  accountId: string
}

const insertNewFixedExpense = async ({ name, amount, date, group_id, accountId }: InsertNewFixedExpenseArg) => {
  const startDate = new Date(date);
  const month = startDate.getUTCMonth();
  const year = startDate.getFullYear();

  const joinedMonth = getJoinedMonth(month, year);
  const previousMonth = getPreviousMonth(month, year);

  const client = await db.connect();

  try {
    await client.query('BEGIN');
    await client.query('DELETE FROM fixed_expenses WHERE group_id=$1 AND to_char(start, \'YYYYMM\')>=$2;', [group_id, joinedMonth]);
    await client.query('DELETE FROM expenses WHERE group_id=$1 AND to_char(date, \'YYYYMM\')>=$2;', [group_id, joinedMonth]);
    let queryResult = await client.query('INSERT INTO fixed_expenses(name, start, amount, group_id, owner_id) VALUES($1, $2, $3, $4, $5) RETURNING id, created_at, group_id', [name, date, amount, group_id, accountId]);
    const inserted = queryResult.rows[0];
    queryResult = await client.query(`
SELECT
  id,
  CONCAT('${previousMonth}', to_char(start, 'DD'))::date as "end",
  created_at
FROM
  fixed_expenses
WHERE
  group_id=$1
AND
  to_char("start", 'YYYYMM')<$2
AND ("end" is null OR to_char("end", 'YYYYMM')>$2)
AND owner_id=$3
LIMIT 1
`, [group_id, joinedMonth, accountId]);
    if (queryResult.rowCount > 0) {
      await client.query(`
UPDATE
	fixed_expenses
SET
	"end"=$1
WHERE
  id=$2
  AND owner_id=$3;
`, [queryResult.rows[0].end, queryResult.rows[0].id, accountId]);
    }
    await client.query('COMMIT;');
    return {
      id: inserted.id,
      name,
      date,
      amount,
      created_at: inserted.created_at,
      group_id: inserted.group_id,
      virtual: true,
      paid: false,
    };
  } catch (e) {
    await client.query('ROLLBACK;');
    throw e;
  } finally {
    client.release();
  }
};

type DeleteFixedExpenseArg = {
  group_id: string,
  yearMonth: string,
  accountId: string
}

const deleteFixedExpense = async ({ group_id, yearMonth, accountId }: DeleteFixedExpenseArg) => {
  const [year, month] = yearMonth.split('-');
  const previousMonth = getPreviousMonth(parseInt(month, 10), parseInt(year, 10));

  const client = await db.connect();

  try {
    await client.query('BEGIN');
    await client.query('DELETE FROM expenses WHERE group_id=$1 AND to_char(date, \'YYYY-MM\')>=$2 AND owner_id=$3;', [group_id, yearMonth, accountId]);
    await client.query('DELETE FROM fixed_expenses WHERE group_id=$1 AND to_char(start, \'YYYY-MM\')>=$2 AND owner_id=$3;', [group_id, yearMonth, accountId]);
    const queryResult = await client.query(`
SELECT
    id,
    CONCAT('${previousMonth}', to_char(start, 'DD'))::date as "end"
FROM fixed_expenses
WHERE
  group_id=$1
  AND "end" is null OR to_char("end", 'YYYY-MM')>$2
  AND owner_id=$3
LIMIT 1
    `, [group_id, yearMonth, accountId]);
    if (queryResult.rowCount > 0) {
      await client.query('UPDATE fixed_expenses SET "end"=$1 WHERE id=$2 AND owner_id=$3;', [queryResult.rows[0].end, queryResult.rows[0].id, accountId]);
    }
    await client.query('COMMIT');
  } catch (e) {
    await client.query('ROLLBACK;');
    throw e;
  } finally {
    client.release();
  }
};

const router = Router();

const createExpenseSchema = Type.Object({
  name: Type.String(),
  date: Type.String({ format: 'date' }),
  amount: Type.Number(),
  paid: Type.Boolean(),
  repeat: Type.Boolean(),
  amountOfSplits: Type.Number({ minimum: 0 })
});

type CreateExpenseType = Static<typeof createExpenseSchema>;

const updateExpenseSchema = Type.Object({
  name: Type.String(),
  date: Type.String({ format: 'date' }),
  amount: Type.Number(),
  paid: Type.Boolean(),
  group_id: Type.String({ format: 'uuid' }),
  only_this_one: Type.Boolean()
});

type UpdateExpenseType = Static<typeof updateExpenseSchema>;

const paySchema = Type.Object({
  name: Type.String(),
  amount: Type.Integer(),
  date: Type.String({ format: 'date-time' }),
  group_id: Type.Union([Type.String({ format: 'uuid' }), Type.Null()]),
  virtual: Type.Boolean()
});

type PayType = Static<typeof paySchema>;

const splitExpenses = ({ name, date, amount, paid, amountOfSplits }: CreateExpenseType, accountId: string) => {
  if (amountOfSplits == 0) {
    return [[name, date, amount, paid, accountId]];
  }

  const result = [];
  for (let i = 1; i <= amountOfSplits; i++) {
    result.push([`${name} ${i}/${amountOfSplits}`, add(parseISO(date), { months: i - 1 }), amount, paid, accountId]);
  }
  return result;
};

router.post('/expenses', authorize, handlePromiseExpress(async (req, res) => {
  const account = getAccountFromReq(req);

  const isValid = ajv.validate<CreateExpenseType>(createExpenseSchema, req.body);
  if (!isValid) {
    return res.status(400).end();
  }

  if (req.body.repeat && req.body.amountOfSplits === 0) {
    const queryResult = await db.query(`
  INSERT INTO
    fixed_expenses(name, start, amount, owner_id)
  VALUES
    ($1, $2, $3, $4)
  RETURNING
      id, group_id, name, start, amount, created_at
  `, [req.body.name, req.body.date, req.body.amount, account.id]);

    const {
      id, group_id, name, start, amount, created_at
    } = queryResult.rows[0];

    return res.send([{
      id, name, date: start, amount, paid: false, created_at, group_id
    }]).end();
  }

  const expenses = splitExpenses(req.body, account.id);
  let counter = 1;
  const values = expenses.map(() => `($${counter++}, $${counter++}, $${counter++}, $${counter++}, $${counter++})`);

  const queryResult = await db.query(`
  INSERT INTO
    expenses(name, date, amount, paid, owner_id)
  VALUES
  ${values.join(',')}
  RETURNING
      id, name, date, amount, paid, group_id, created_at
  `, expenses.flat());

  return res.send(queryResult.rows).end();
}));

router.get('/expenses', authorize, handlePromiseExpress(async (req, res) => {
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

  let queryResult = await db.query('SELECT * FROM expenses WHERE owner_id=$1 AND EXTRACT(YEAR FROM date)=$2 AND EXTRACT(MONTH FROM date)=$3', [account.id, year, month]);
  const expenses = queryResult.rows;
  queryResult = await db.query('SELECT * FROM fixed_expenses WHERE group_id != ALL($1::uuid[]) AND owner_id=$2 AND to_char(start, \'YYYYMM\')<=$3 AND ("end" is null OR to_char("end", \'YYYYMM\')>$3)', [expenses.filter(e => e.group_id !== null).map(e => e.group_id), account.id, `${year}${month.padStart(2, '0')}`]);

  res.send([
    ...expenses.map(e => ({ ...e, amount: parseInt(e.amount, 10), virtual: false })),
    ...queryResult.rows
      .map(({ id, name, amount, start, group_id, created_at, owner_id }) => ({
        id,
        name,
        amount: parseInt(amount),
        created_at,
        owner_id,
        group_id,
        date: new Date(`${year}-${month}-${new Date(start).getUTCDate().toString().padStart(2, '0')}`),
        paid: false,
        virtual: true,
        canceled: false,
      }))
  ].filter(e => !e.canceled).sort((a, b) => a.date.getTime() - b.date.getTime())).end();
}));

router.get('/expenses/:id', authorize, handlePromiseExpress(async (req, res) => {
  const account = getAccountFromReq(req);

  if (req.query.virtual === 'true') {
    const month = req.query.month || format(new Date(), 'yyyy-MM');
    const queryResult = await db.query('SELECT * FROM fixed_expenses WHERE group_id=$1 AND owner_id=$2 AND to_char(start, \'YYYY-MM\')<=$3 AND ("end" is null OR to_char("end", \'YYYY-MM\')>=$3)', [req.params.id, account.id, month]);

    if (queryResult.rowCount === 0) {
      return res.status(404).end();
    }

    const { id, name, amount, start, group_id, created_at, owner_id } = queryResult.rows[0];

    return res.send({
      id,
      name,
      amount: parseInt(amount),
      created_at,
      owner_id,
      group_id,
      date: new Date(`${month}-${new Date(start).getUTCDate().toString().padStart(2, '0')}`),
      paid: false,
      virtual: true
    }).end();
  }

  const queryResult = await db.query('SELECT * FROM expenses WHERE id=$1 AND owner_id=$2', [req.params.id, account.id]);

  if (queryResult.rowCount === 0) {
    return res.status(404).end();
  }

  return res.send(queryResult.rows[0]).end();
}));

router.delete('/expenses/:id', authorize, handlePromiseExpress(async (req, res) => {
  const account = getAccountFromReq(req);
  const yearMonth = req.query.month as string || format(new Date(), 'yyyy-MM');

  if (req.query.virtual && req.query.virtual === 'true') {

    if (req.query.only_this_one === 'true') {
      await db.query(`
  INSERT INTO
    expenses(name, date, amount, owner_id, group_id, canceled)
  VALUES
    ('canceled', $1, $2, $3, $4, TRUE)
  `, [`${yearMonth}-01`, 0, account.id, req.params.id]);
      return res.status(204).end();
    }

    await deleteFixedExpense({
      group_id: req.query.group_id as string,
      yearMonth,
      accountId: account.id
    });

    return res.status(204).end();
  }

  if (req.query.group_id) {
    if (req.query.only_this_one === 'true') {
      await db.query(`
  UPDATE expenses
  SET canceled=TRUE
  WHERE id=$1 AND group_id=$2 AND owner_id=$3
  `, [req.params.id, req.query.group_id, account.id]);
      return res.status(204).end();
    }

    await deleteFixedExpense({
      group_id: req.query.group_id as string,
      yearMonth,
      accountId: account.id
    });

    return res.status(204).end();
  }

  const queryResult = await db.query('DELETE FROM expenses WHERE id=$1 AND owner_id=$2', [req.params.id, account.id]);
  if (queryResult.rowCount === 0) {
    return res.status(404).end();
  }
  return res.status(204).end();
}));

router.post('/expenses/:id/pay', authorize, handlePromiseExpress(async (req, res) => {
  const account = getAccountFromReq(req);

  const validate = ajv.compile<PayType>(paySchema);
  const isValid = validate(req.body);

  if (!isValid) {
    return res.status(400).send(validate.errors).end();
  }

  const { name, date, amount, group_id } = req.body;
  if (req.body.virtual) {
    const queryResult = await db.query(`
  INSERT INTO
    expenses(name, date, amount, paid, owner_id, group_id)
  VALUES
    ($1, $2, $3, TRUE, $4, $5)
  RETURNING
      id, name, date, amount, paid, created_at, group_id
  `, [name, date, amount, account.id, group_id]);
    if (queryResult.rowCount === 0) {
      return res.status(404).end();
    }
    return res.send(queryResult.rows[0]).end();
  }

  const queryResult = await db.query('UPDATE expenses SET paid=\'TRUE\' WHERE id=$1 AND owner_id=$2 RETURNING id, name, date, amount, paid, created_at, group_id', [req.params.id, account.id]);

  if (queryResult.rowCount === 0) {
    return res.status(404).end();
  }

  return res.send(queryResult.rows[0]).end();
}));

router.put('/expenses/:id', authorize, handlePromiseExpress(async (req, res) => {
  const account = getAccountFromReq(req);

  const isValid = ajv.validate<UpdateExpenseType>(updateExpenseSchema, req.body);
  if (!isValid) {
    return res.status(400).end();
  }

  const { name, date, amount, paid, group_id } = req.body;

  if (req.query.virtual && req.query.virtual === 'true') {
    if (req.body.only_this_one) {
      const queryResult = await db.query(`
  INSERT INTO
    expenses(name, date, amount, paid, owner_id, group_id)
  VALUES
    ($1, $2, $3, $4, $5, $6)
  RETURNING
      id, name, date, amount, paid, created_at, group_id
  `, [name, date, amount, paid, account.id, group_id]);
      return res.send(queryResult.rows[0]).end();
    }

    const fixed = await insertNewFixedExpense({
      name,
      date,
      amount,
      group_id,
      accountId: account.id
    });
    return res.send(fixed).end();
  }

  if (req.body.group_id && !req.body.only_this_one) {
    const fixed = await insertNewFixedExpense({
      name,
      date,
      amount,
      group_id,
      accountId: account.id
    });
    return res.send(fixed).end();
  }

  const queryResult = await db.query(`
  UPDATE
    expenses
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
