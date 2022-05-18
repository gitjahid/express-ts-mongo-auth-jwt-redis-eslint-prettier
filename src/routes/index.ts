import express from 'express';

// Middlewares
import authenticate from '@middlewares/auth/authenticate';
import hasRole from '@middlewares/auth/hasRole';

// Routes
import usersRoutes from './users';
import authRoutes from './auth';

const router = express.Router();

/**
 * @method - GET, POST, PUT, DELETE
 * @router - /users
 * @param - -
 * @description - Users Routes
 */
router.use('/users', [authenticate, hasRole(['Admin'])], usersRoutes);

/**
 * @method - GET, POST, PUT, DELETE
 * @router - /auth
 * @param - -
 * @description - Auth Routes
 */
router.use('/auth', authRoutes);

export default router;
