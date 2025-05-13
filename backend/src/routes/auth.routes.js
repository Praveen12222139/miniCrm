const router = require('express').Router();
const passport = require('passport');

// Google OAuth routes
router.get('/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get('/google/callback',
  passport.authenticate('google', { failureRedirect: '/api/auth/login-failed' }),
  (req, res) => {
    // Set session and redirect to frontend
    req.session.authenticated = true;
    res.redirect('http://localhost:8080');
  }
);

// Login success/failure routes
router.get('/login-success', (req, res) => {
  if (req.isAuthenticated()) {
    res.redirect('http://localhost:8080');
  } else {
    res.redirect('http://localhost:8080/login');
  }
});

router.get('/login-failed', (req, res) => {
  res.redirect('http://localhost:8080/login');
});

// Check authentication status
router.get('/check-auth', (req, res) => {
  if (req.isAuthenticated()) {
    res.json({
      authenticated: true,
      user: req.user
    });
  } else {
    res.json({
      authenticated: false
    });
  }
});

// Add a route to get user data
router.get('/user', (req, res) => {
  if (req.isAuthenticated()) {
    res.json(req.user);
  } else {
    res.status(401).json({
      error: 'Not authenticated'
    });
  }
});

// Get current user
router.get('/me', (req, res) => {
  if (req.isAuthenticated()) {
    res.json({
      authenticated: true,
      user: req.user
    });
  } else {
    res.status(401).json({
      authenticated: false,
      message: 'Not authenticated'
    });
  }
});

// Logout route
router.post('/logout', (req, res) => {
  req.logout((err) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: 'Error logging out'
      });
    }
    res.json({
      success: true,
      message: 'Logged out successfully'
    });
  });
});

module.exports = router;
