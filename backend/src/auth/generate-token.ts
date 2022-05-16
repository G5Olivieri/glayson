import { generateTokenToPassword } from '@app/auth/generate-token/password';
import { generateTokenToRefreshToken } from '@app/auth/generate-token/refresh-token';
import { Request, Response } from 'express';

export const generateToken = async (req: Request, res: Response) => {
  const expires_in = 1800; // 30m

  if (req.body.grant_type === 'password') {
    return generateTokenToPassword(req, res, expires_in);
  }

  if (req.body.grant_type === 'refresh_token') {
    return generateTokenToRefreshToken(req, res, expires_in);
  }

  res.status(400).end();
};
