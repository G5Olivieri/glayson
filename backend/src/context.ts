import { Account } from '@app/auth/account';
import { Request } from 'express';
import crypto from 'crypto';

export class Context {
  private static _bindings = new WeakMap<Request, Context>();

  public account: Account | null = null;

  constructor(public readonly requestId: string) { /* */ }

  public setAccount(account: Account) {
    this.account = account;
  }

  static bind(req: Request): void {
    const ctx = new Context(crypto.randomUUID());
    Context._bindings.set(req, ctx);
  }

  static get(req: Request): Context {
    const context = Context._bindings.get(req);
    if (!context) {
      throw Error('none context');
    }
    return context;
  }
}
