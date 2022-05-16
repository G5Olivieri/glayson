import { RequestHandler } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { db } from '@app/db';
import { Context } from '@app/context';

export const authorize: RequestHandler = async (req, res, next) => {
  const authorization = req.headers['authorization'];
  if (!authorization) {
    return res.status(401).end();
  }
  const [scheme, token] = authorization.split(' ');
  if (scheme !== 'Bearer' || token === undefined || token === '') {
    return res.status(401).end();
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
    const invalidTokensqueryResult = await db.query('SELECT * FROM invalid_tokens WHERE access_token=$1 LIMIT 1;', [req.body.access_token]);
    if (invalidTokensqueryResult.rowCount > 0) {
      return res.status(401).end();
    }
    const queryResult = await db.query('SELECT id, username, password FROM accounts WHERE id=$1 LIMIT 1', [payload.sub]);
    if (queryResult.rowCount === 0) {
      return res.status(401).end();
    }
    const context = Context.get(req);
    context.setAccount(queryResult.rows[0]);
    return next();
  } catch (error) {
    return res.status(401).end();
  }
};
