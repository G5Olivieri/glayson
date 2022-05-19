import { ajv } from '@app/ajv';
import { authorize } from '@app/auth/authorize';
import { getAccountFromReq } from '@app/auth/get-account-from-req';
import { db } from '@app/db';
import { handlePromiseExpress } from '@app/handlePromiseExpress';
import { Static, Type } from '@sinclair/typebox';
import { Router } from 'express';
import webPush from 'web-push';

const registerSubscriptionSchema = Type.Object({
  subscription: Type.Any(),
});

type RegisterSubscriptionType = Static<typeof registerSubscriptionSchema>;

// Set the keys used for encrypting the push messages.
webPush.setVapidDetails(
  process.env.HOST!,
  process.env.VAPID_PUBLIC_KEY!,
  process.env.VAPID_PRIVATE_KEY!
);

const router = Router();

router.get('/vapid-public-key', authorize, (_req, res) => {
  res.send(process.env.VAPID_PUBLIC_KEY);
});

const getUA = (userAgent?: string) => {
  if (!userAgent) {
    return 'Unknown';
  }

  const ua: any = {
    'Android': /Android/i,
    'iPhone': /iPhone/i,
    'Generic Linux': /Linux/i,
    'BlackBerry': /BlackBerry/i,
    'Bluebird': /EF500/i,
    'Chrome OS': /CrOS/i,
    'Datalogic': /DL-AXIS/i,
    'Honeywell': /CT50/i,
    'iPad': /iPad/i,
    'iPod': /iPod/i,
    'macOS': /Macintosh/i,
    'Windows': /IEMobile|Windows/i,
    'Zebra': /TC70|TC55/i,
  };
  return Object.keys(ua).find(v => userAgent.match(ua[v])) || 'Unknown';
};


router.post('/register', authorize, handlePromiseExpress(async (req, res) => {
  const account = getAccountFromReq(req);

  const isValid = ajv.validate<RegisterSubscriptionType>(registerSubscriptionSchema, req.body);
  if (!isValid) {
    return res.status(400).end();
  }

  const { subscription } = req.body;
  const device = getUA(req.headers['user-agent']);

  const queryResult = await db.query('SELECT * FROM subscriptions WHERE device=$1 AND owner_id=$2 LIMIT 1', [device, account.id]);
  if (queryResult.rowCount > 0) {
    const subs = queryResult.rows[0];
    const subJson = JSON.stringify(subscription);
    if (subs.subscription === subJson) {
      res.status(204).end();
      return;
    }
    await db.query('UPDATE subscriptions SET subscription=$2 WHERE id=$1', [queryResult.rows[0].id, JSON.stringify(subscription)]);
    res.status(204).end();
    return;
  }

  await db.query('INSERT INTO subscriptions(device, owner_id, subscription) VALUES($1, $2, $3)', [device, account.id, JSON.stringify(subscription)]);
  res.status(204).end();
}));

router.post('/send-notification', authorize, handlePromiseExpress(async (req, res) => {
  const { payload } = req.body;
  const queryResult = await db.query('SELECT subscription from subscriptions');

  queryResult.rows.forEach(({ subscription }) => {
    webPush.sendNotification(JSON.parse(subscription), JSON.stringify(payload), { TTL: 60 })
      .then(() => {
        res.status(204).end();
      }).catch((e) => {
        console.error(e);
        res.status(500).end();
      });
  });
}));

export { router };
