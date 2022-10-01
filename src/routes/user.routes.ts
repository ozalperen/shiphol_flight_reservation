import express from 'express';
import { getMeHandler } from '../controllers/user.controller';
import { deserializeUser } from '../middleware/deserializeUser';
import { requireUser } from '../middleware/requireUser';
import { validate } from '../middleware/validate';
import { updateUserHandler } from '../controllers/user.controller';

const router = express.Router();

router.use(deserializeUser, requireUser);

// Get currently logged in user
router
    .route('/me')
    .get(getMeHandler)
    .patch(updateUserHandler);

export default router;