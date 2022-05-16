import { RequestHandler } from 'express';

interface ParsedQs { [key: string]: undefined | string | string[] | ParsedQs | ParsedQs[] }

export interface ParamsDictionary {
    [key: string]: string;
}

export const handlePromiseExpress = (handler: RequestHandler): RequestHandler => (req, res, next) => {
  (handler(req, res, next) as unknown as Promise<void>).catch(next);
};
