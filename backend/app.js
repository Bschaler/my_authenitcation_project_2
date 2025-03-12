// backend/app.js
const express = require('express');
require('express-async-errors');                // Automatically catch async errors
const morgan = require('morgan');               // HTTP request logger
const cors = require('cors');                   // Cross-Origin Resource Sharing
const csurf = require('csurf');                 // CSRF protection
const helmet = require('helmet');               // Security headers
const cookieParser = require('cookie-parser');  // Parse cookies in requests

const { environment } = require('./config');
const isProduction = environment === 'production';

const app = express();

// Connect morgan middleware for logging HTTP requests
app.use(morgan('dev'));

// Parse cookies and JSON bodies
app.use(cookieParser());
app.use(express.json());

// Security middleware
if (!isProduction) {
  // Enable CORS only in development
  // In production, frontend and backend should be on same domain
  app.use(cors());
}

// Helmet helps set security headers
app.use(
  helmet.crossOriginResourcePolicy({
    policy: "cross-origin"                  // Allow resources to be shared cross-origin
  })
);

// Set the _csrf token and create req.csrfToken method
app.use(
  csurf({
    cookie: {
      secure: isProduction,                 // HTTPS only in production
      sameSite: isProduction && "Lax",      // Controls when cookies are sent with cross-site requests
      httpOnly: true                        // Prevents JavaScript access to cookies
    }
  })
);

// Connect routes
const routes = require('./routes');
app.use(routes);

module.exports = app;