import { generateToken } from '@app/auth/generate-token';
import { checkToken } from '@app/auth/check-token';
import { handlePromiseExpress } from '@app/handlePromiseExpress';
import { Router } from 'express';
import { invalidateToken } from '@app/auth/invalidate-token';

export const router = Router();

router.post('/token', handlePromiseExpress(generateToken));
router.post('/token/invalidate', handlePromiseExpress(invalidateToken));
router.post('/token/check', handlePromiseExpress(checkToken));
