import { ajv } from '@app/ajv';
import { db } from '@app/db';
import { Type } from '@sinclair/typebox';
import crypto from 'crypto';
import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';

const refreshTokenSchema = Type.Object({
  grant_type: Type.Literal('refresh_token'),
  access_token: Type.String(),
  refresh_token: Type.String(),
});

export const generateTokenToRefreshToken = async (req: Request, res: Response, expires_in: number) => {
  const isValid = ajv.validate(refreshTokenSchema, req.body);
  if (!isValid) {
    return res.status(400).end();
  }

  const queryResult = await db.query('SELECT id FROM invalid_tokens WHERE access_token=$1 LIMIT 1;', [req.body.access_token]);
  if (queryResult.rowCount > 0) {
    res.status(401).end();
    return;
  }
  const accessTokenPayload = jwt.verify(req.body.access_token, process.env.JWT_SECRET!, { ignoreExpiration: true });
  const refreshTokenPayload = jwt.verify(req.body.refresh_token, process.env.JWT_SECRET!);

  const hmacOldToken = crypto.createHmac('sha256', process.env.JWT_SECRET!);
  hmacOldToken.update(req.body.access_token);
  const hmacOldAccessToken = hmacOldToken.digest('base64url');

  if (!crypto.timingSafeEqual(Buffer.from((refreshTokenPayload.sub as unknown) as string), Buffer.from(hmacOldAccessToken))) {
    return res.status(401).end();
  }

  const access_token = await jwt.sign({}, process.env.JWT_SECRET!, {
    subject: (accessTokenPayload.sub as unknown as string),
    expiresIn: expires_in,
  });
  const hmac = crypto.createHmac('sha256', process.env.JWT_SECRET!);
  hmac.update(access_token);
  const hmacAccessToken = hmacOldToken.digest('base64url');

  const refresh_token = await jwt.sign({}, process.env.JWT_SECRET!, {
    subject: hmacAccessToken,
    expiresIn: '1d'
  });

  await db.query('INSERT INTO invalid_tokens(access_token) VALUES($1)', [req.body.access_token]);

  return res.send({
    access_token,
    refresh_token,
    expires_in,
  }).end();
};
