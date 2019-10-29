const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const router = require('express').Router();
const { JWT: { secret, expiresIn } } = require('../helpers/config');
const { User } = require('../models');
const verifyToken = require('../helpers/verifyToken');

router.post('/addUser', verifyToken({ isAdmin: true }), async (req, res) => {
  const loginExists = await User.findOne({ login: req.body.login });

  if (loginExists) return res.status(409).json({ error: 'User with such login already exist' });

  try {
    const hash = await bcrypt.hash(req.body.password, 10);
    const savedUser = await User.create({
      login: req.body.login,
      password: hash,
    });
    res.json(savedUser);
  } catch (err) {
    res.status(400).json(err.message);
  }
});

router.post('/login', async (req, res) => {
  const user = await User.findOne({ login: req.body.login });

  if (!user) return res.status(400).json({ error: 'User not found' });

  bcrypt.compare(req.body.password, user.password, (err, correct) => {
    if (err) return res.status(401).json({ error: 'Auth failed' });
    else if (!correct) return res.status(400).json({ error: 'User not found' });

    const { _id: id, login, isAdmin } = user;

    jwt.sign({ 
      id,
      login,
      isAdmin,
    },
    secret,
    { expiresIn },
    (err, token) => {
      if (err) return res.status(401).json({ error: 'Auth failed' });

      res.header('auth', token).json({ 
        token,
        id,
        login,
        isAdmin,
      });
    });
  });
});

module.exports = router;
