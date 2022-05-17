if (process.env.NODE_ENV !== 'development') {
  require('module-alias/register');
}

import { router as authRouter } from '@app/auth/routes';
import { router as bloguinhoRouter } from '@app/bloguinho/routes';
import { Context } from '@app/context';
import { db } from '@app/db';
import { router as financeiroRouter } from '@app/financeiro/routes';
import { router as webpushRouter } from '@app/webpush/routes';
import bodyParser from 'body-parser';
import cors from 'cors';
import express from 'express';
import path from 'path';
import webPush from 'web-push';

if (!process.env.VAPID_PUBLIC_KEY || !process.env.VAPID_PRIVATE_KEY) {
  console.log('You must set the VAPID_PUBLIC_KEY and VAPID_PRIVATE_KEY ' +
    'environment variables. You can use the following ones:');
  console.log(webPush.generateVAPIDKeys());
  process.exit(1);
}

db.connect().catch((error) => {
  console.error(error);
  process.exit(0);
});

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(cors());
app.use((req, res, next) => {
  Context.bind(req);
  next();
});

app.use('/api/auth', authRouter);
app.use('/api/bloguinho', bloguinhoRouter);
app.use('/api/financeiro', financeiroRouter);
app.use('/api/webpush', webpushRouter);

if (process.env.NODE_ENV !== 'development') {
  app.use(express.static(path.resolve(__dirname, 'public')));

  app.get('*', (req, res) => {
    res.setHeader('content-type', 'text/html');
    res.sendFile(path.resolve(__dirname, 'public/index.html'));
  });
}

const PORT = parseInt(process.env.PORT || '3000');
const server = app.listen(PORT);

console.log(`listening on ${PORT}`);

process.on('SIGINT', () => {
  server.close(() => {
    db.end().then(() => {
      console.log('shutdown');
    });
  });
});
