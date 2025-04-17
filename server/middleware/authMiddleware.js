// server/middleware/authMiddleware.js
const protect = (req, res, next) => {
    // Temporary dummy auth for testing
    console.log('Auth middleware triggered');
    next();
  };
  
  module.exports = { protect };
  