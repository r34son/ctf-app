const bcrypt = require('bcrypt');
const router = require('express').Router();
const { Task, User } = require('../models');
const verifyToken = require('../helpers/verifyToken');

router.get('/', verifyToken(), async (req, res, next) => {
  const tasks = Task.find();

  res.json(tasks);
});

router.post('/add', verifyToken({ isAdmin: true }), async (req, res, next) => {
  const { title, description, flag, enbaled = true } = req.body;

  try {
    const hash = await bcrypt.hash(flag, 10);
    const task = Task.create({
      title,
      description,
      flag: hash,
      enbaled,
    });

    res.json(task);
  } catch (err) {
    res.status(400).json(err);
  }
});

router.post('/submit', verifyToken(), async (req, res, next) => {
  
});

module.exports = router;
