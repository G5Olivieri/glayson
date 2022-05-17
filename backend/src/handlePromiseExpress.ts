import { RequestHandler } from 'express';

export interface ParamsDictionary {
    [key: string]: string;
}

export const handlePromiseExpress = (handler: RequestHandler): RequestHandler => (req, res, next) => {
  (handler(req, res, next) as unknown as Promise<void>).catch(next);
};
