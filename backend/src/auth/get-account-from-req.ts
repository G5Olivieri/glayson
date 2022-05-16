import { Request } from 'express';
import { Context } from '@app/context';

export const getAccountFromReq = (req: Request) => {
  const context = Context.get(req);
  const account = context.account;

  if (!account) {
    throw new Error('none account');
  }

  return account;
};
