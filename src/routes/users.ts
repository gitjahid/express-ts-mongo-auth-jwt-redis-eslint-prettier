import express from 'express';

// Controllers
import users from '@controllers/users';

const router = express.Router();

/**
 * @method - GET
 * @router - /users/all
 * @param - page?, size?
 * @description - Get all users from database with pagination
 * @return - All users with pagination
 */
router.get('/all', users.getAll);

export default router;
