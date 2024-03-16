const rateLimiter = require('express-rate-limit');

const rateLimiterMiddleware = rateLimiter({
  windowMs: 60 * 60 * 1000,
  max: 100,
  message: 'Превышен лимит запросов, пожалуйста, попробуйте позже.',
});

module.exports = rateLimiterMiddleware;

