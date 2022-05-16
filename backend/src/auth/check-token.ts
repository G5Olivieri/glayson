import { ajv } from '@app/ajv';
import { db } from '@app/db';
import { Static, Type } from '@sinclair/typebox';
import { Request, Response } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';

const validateSchema = Type.Object({
  access_token: Type.String(),
});
type ValidateTokenType = Static<typeof validateSchema>


export const checkToken = async (req: Request, res: Response) => {
  const isValid = ajv.validate<ValidateTokenType>(validateSchema, req.body);
  if (!isValid) {
    res.status(400).end();
    return;
  }

  try {
    const payload = jwt.verify(req.body.access_token, process.env.JWT_SECRET!) as JwtPayload;
    const invalidTokensqueryResult = await db.query('SELECT * FROM invalid_tokens WHERE access_token=$1 LIMIT 1;', [req.body.access_token]);
    if (invalidTokensqueryResult.rowCount > 0) {
      return res.status(401).end();
    }
    const queryResult = await db.query('SELECT id, username, password FROM accounts WHERE id=$1 LIMIT 1', [payload.sub]);
    if (queryResult.rowCount === 0) {
      return res.status(401).end();
    }
    return res.end();
  } catch (error) {
    return res.status(401).end();
  }
};
