import { ajv } from '@app/ajv';
import { authorize } from '@app/auth/authorize';
import { getAccountFromReq } from '@app/auth/get-account-from-req';
import { db } from '@app/db';
import { handlePromiseExpress } from '@app/handlePromiseExpress';
import { Static, Type } from '@sinclair/typebox';
import { Router } from 'express';

const createTaskSchema = Type.Object({
  name: Type.String(),
});

type CreateTaskType = Static<typeof createTaskSchema>;

const updateTaskSchema = Type.Object({
  name: Type.String(),
  done: Type.Boolean(),
});

type UpdateTaskType = Static<typeof updateTaskSchema>;

const router = Router();

router.get('/tasks', authorize, handlePromiseExpress(async (req, res) => {
  const account = getAccountFromReq(req);
  const queryResult = await db.query('SELECT * FROM tasks WHERE assigned_to_id=$1', [account.id]);
  res.send(queryResult.rows).end();
}));

router.post('/tasks', authorize, handlePromiseExpress(async (req, res) => {
  const isValid = ajv.validate<CreateTaskType>(createTaskSchema, req.body);
  if (!isValid) {
    return res.status(400).end();
  }

  const account = getAccountFromReq(req);

  const queryResult = await db.query('INSERT INTO tasks(name, assigned_to_id) VALUES($1, $2) RETURNING id, name, created_at, done', [req.body.name, account.id]);
  if (queryResult.rowCount === 0) {
    return res.status(500).end();
  }

  res.send(queryResult.rows[0]);
}));

router.get('/tasks/:id', authorize, handlePromiseExpress(async (req, res) => {
  const account = getAccountFromReq(req);
  const queryResult = await db.query('SELECT * FROM tasks WHERE id=$1 AND assigned_to_id=$2 LIMIT 1', [req.params.id, account.id]);
  if (queryResult.rowCount === 0) {
    return res.status(404).end();
  }
  return res.send(queryResult.rows[0]);
}));

router.put('/tasks/:id', authorize, handlePromiseExpress(async (req, res) => {
  const isValid = ajv.validate<UpdateTaskType>(updateTaskSchema, req.body);
  if (!isValid) {
    return res.status(400).end();
  }

  const account = getAccountFromReq(req);

  const queryResult = await db.query('UPDATE tasks SET name=$1, done=$2 WHERE id=$3 AND assigned_to_id=$4', [req.body.name, req.body.done, req.params.id, account.id]);
  if (queryResult.rowCount === 0) {
    return res.status(404).end();
  }

  return res.status(204).end();
}));

router.delete('/tasks/:id', authorize, handlePromiseExpress(async (req, res) => {
  const account = getAccountFromReq(req);
  const queryResult = await db.query('DELETE FROM tasks WHERE id=$1 AND assigned_to_id=$2', [req.params.id, account.id]);
  if (queryResult.rowCount === 0) {
    return res.status(404).end();
  }
  return res.send(queryResult.rows[0]);
}));

export { router };
