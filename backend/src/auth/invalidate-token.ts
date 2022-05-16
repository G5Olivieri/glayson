import { ajv } from '@app/ajv';
import { db } from '@app/db';
import { Type, Static } from '@sinclair/typebox';
import { Request, Response } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';

const invalidateSchema = Type.Object({
  access_token: Type.String(),
});
type InvalidateTokenType = Static<typeof invalidateSchema>


export const invalidateToken = async (req: Request, res: Response) => {
  const isValid = ajv.validate<InvalidateTokenType>(invalidateSchema, req.body);
  if (!isValid) {
    res.status(400).end();
    return;
  }

  try {
    // avoid populate database
    const payload = jwt.verify(req.body.access_token, process.env.JWT_SECRET!) as JwtPayload ;
    let queryResult = await db.query('SELECT id, username, password FROM accounts WHERE username=$1 LIMIT 1', [payload.sub]);
    if(queryResult.rowCount === 0) {
      return res.end();
    }
    queryResult = await db.query('SELECT id FROM invalid_tokens WHERE access_token=$1 LIMIT 1', [req.body.access_token]);
    if(queryResult.rowCount > 0) {
      return res.end();
    }
    await db.query('INSERT INTO invalid_tokens(access_token) VALUES($1)', [req.body.access_token]);
  } catch(error) { /* ignore */ }

  res.end();
};
