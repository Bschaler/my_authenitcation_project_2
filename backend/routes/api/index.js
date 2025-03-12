// backend/routes/api/index.js
const router = require('express').Router();

// Test route to check if API router is working
router.post('/test', function(req, res) {      // Define a POST endpoint at /api/test
  res.json({ requestBody: req.body });         // Echo back the request body as JSON
});

// GET /api/set-token-cookie
const { setTokenCookie } = require('../../utils/auth.js');
const { User } = require('../../db/models');
router.get('/set-token-cookie', async (_req, res) => {
  const user = await User.findOne({                // Find the demo user
    where: {
      username: 'Demo-lition'
    }
  });
  setTokenCookie(res, user);                      // Set a JWT cookie for this user
  return res.json({ user: user });                // Return the user in the response
});

// GET /api/restore-user
const { restoreUser } = require('../../utils/auth.js');

router.use(restoreUser);                          // Apply restoreUser middleware to all routes

router.get(
  '/restore-user',
  (req, res) => {
    return res.json(req.user);                    // Return the current user from the request
  }
);

// GET /api/require-auth
const { requireAuth } = require('../../utils/auth.js');
router.get(
  '/require-auth',
  requireAuth,                                    // Apply requireAuth middleware to this route
  (req, res) => {
    return res.json(req.user);                    // Return the authenticated user
  }
);

module.exports = router;