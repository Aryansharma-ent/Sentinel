import express from 'express';
import { getStats } from '../Controllers/statsController.js';

const router = express.Router();

router.get('/stats', getStats);

export default router;
