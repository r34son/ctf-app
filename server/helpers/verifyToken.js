const jwt = require('jsonwebtoken');
const { JWT: { secret } } = require('./config');

function verifyToken(toCompare) {
  return (req, res, next) => {
    const token = req.header('auth');

    if (!token) return res.status(401).json({ error: 'Not authorized' });
  
    jwt.verify(token, secret, (err, user) => {
      if (err) return res.status(403).json({ error: 'Invalid token' });
  
      if (toCompare) {
        for (keyToCompare in toCompare) {
          if (user[keyToCompare] !== toCompare[keyToCompare]) {
            return res.status(401).json({ error: 'Unauthorized' });
          }
        }
      }
  
      req.userId = user._id;
      next();
    });
  }
}

module.exports = verifyToken;
