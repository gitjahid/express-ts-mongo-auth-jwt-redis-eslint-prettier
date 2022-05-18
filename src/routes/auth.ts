import express from 'express';

// Controllers
import auth from '@controllers/auth';

// Middlewares
import authenticate from '@middlewares/auth/authenticate';

const router = express.Router();

/**
 * @method - GET
 * @router - /session
 * @param - -
 * @description - Get current session user
 */
router.get('/session', [authenticate], auth.session);

/**
 * @method - POST
 * @router - /signup
 * @param - fullName, email, password
 * @description - Create new user
 */
router.post('/signup', auth.signup);

/**
 * @method - POST
 * @router - /signin
 * @param - email, password
 * @description - SignIn a user
 */
router.post('/signin', auth.signin);

/**
 * @method - POST
 * @router - /refresh-token
 * @param - -
 * @description - Refresh current refresh token
 */
router.post('/refresh-token', auth.refresh);

/**
 * @method - DELETE
 * @router - /signout
 * @param - -
 * @description - Signout a user
 */
router.delete('/signout', auth.signout);

export default router;
