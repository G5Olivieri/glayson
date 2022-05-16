import { ajv } from '@app/ajv';
import { authorize } from '@app/auth/authorize';
import { Context } from '@app/context';
import { db } from '@app/db';
import { handlePromiseExpress } from '@app/handlePromiseExpress';
import { Type, Static } from '@sinclair/typebox';
import { Router } from 'express';

const router = Router();

const createPostSchema = Type.Object({
  text: Type.String()
});

type CreatePostType = Static<typeof createPostSchema>;

router.post('/posts', authorize, handlePromiseExpress(async (req, res) => {
  const context = Context.get(req);
  const account = context.account;
  if (!account) {
    throw new Error('none account');
  }

  const isValid = ajv.validate<CreatePostType>(createPostSchema, req.body);
  if (!isValid) {
    return res.status(400).end();
  }

  const queryResult = await db.query('INSERT INTO posts(text, author_id) VALUES($1, $2) RETURNING id, text, created_at', [req.body.text, account.id]);

  return res.send({
    ...queryResult.rows[0]
  }).end();
}));

router.get('/posts', authorize, handlePromiseExpress(async (req, res) => {
  const context = Context.get(req);
  const account = context.account;
  if(!account) {
    throw new Error('none account');
  }

  const queryResult = await db.query('SELECT * FROM posts WHERE author_id=$1 ORDER BY created_at DESC', [account.id]);
  return res.send(queryResult.rows).end();
}));

router.get('/posts/:id', authorize, handlePromiseExpress(async (req, res) => {
  const context = Context.get(req);
  const account = context.account;

  if (!account) {
    throw new Error('none account');
  }

  const queryResult = await db.query('SELECT * FROM posts WHERE id=$1 AND author_id=$2', [req.params.id, account.id]);

  if (queryResult.rowCount === 0) {
    return res.status(404).end();
  }
  return res.send(queryResult.rows[0]).end();
}));

router.delete('/posts/:id', authorize, handlePromiseExpress(async (req, res) => {
  const context = Context.get(req);
  const account = context.account;

  if (!account) {
    throw new Error('none account');
  }

  console.log(account.id);
  const queryResult = await db.query('DELETE FROM posts WHERE id=$1 AND author_id=$2', [req.params.id, account.id]);
  if (queryResult.rowCount === 0) {
    return res.status(404).end();
  }
  return res.status(204).end();
}));

export { router };