import { ajv } from '@app/ajv';
import { db } from '@app/db';
import { Type } from '@sinclair/typebox';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';

const passwordSchema = Type.Object({
  grant_type: Type.Literal('password'),
  username: Type.String(),
  password: Type.String(),
});

export const generateTokenToPassword = async (req: Request, res: Response, expires_in: number) => {
  const isValid = ajv.validate(passwordSchema, req.body);
  if (isValid) {
    const queryResult = await db.query('SELECT id, username, password FROM accounts WHERE username=$1 LIMIT 1', [req.body.username]);
    if (queryResult.rowCount === 0) {
      res.status(401).end();
      return;
    }
    const account = queryResult.rows[0];
    const isEqual = await bcrypt.compare(req.body.password, account.password);

    if (!isEqual) {
      return res.status(401).end();
    }

    const access_token = jwt.sign({}, process.env.JWT_SECRET!, {
      subject: account.id,
      expiresIn: expires_in,
    });
    const hmac = crypto.createHmac('sha256', process.env.JWT_SECRET!);
    hmac.update(access_token);
    const hmacAccessToken = hmac.digest('base64url');

    const refresh_token = jwt.sign({}, process.env.JWT_SECRET!, {
      subject: hmacAccessToken,
      expiresIn: '1d'
    });

    return res.send({
      access_token,
      refresh_token,
      expires_in,
    }).end();
  }
};
