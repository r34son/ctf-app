const jwt = require('jsonwebtoken');
const { JWT: { secret } } = require('./config');

function verifyToken(toCompare) {
  return (req, res, next) => {
    const token = req.header('auth');

    if (!token) return res.status(401).json({ error: 'Not authorized' });
  
    jwt.verify(token, secret, (err, user) => {
      if (err) return res.status(403).json({ error: 'Invalid token' });

      req.userId = user.id;
      req.isAdmin = user.isAdmin;
  
      if (toCompare) {
        for (keyToCompare in toCompare) {
          if (user[keyToCompare] !== toCompare[keyToCompare]) {
            return res.status(401).json({ error: 'Unauthorized' });
          }
        }
      }
  
      next();
    });
  }
}

module.exports = verifyToken;
