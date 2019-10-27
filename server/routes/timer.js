const router = require('express').Router();
const verifyToken = require('../helpers/verifyToken');
const { Task, User, Timer } = require('../models');

router.get('/timeLeft', async (req, res, next) => {
  const timer = await Timer.findOne();
  const timeLeft = Math.abs(timer.createdAt + timer.duration - Date.now());

  res.json({ timeLeft });
});

router.post('/start', verifyToken({ isAdmin: true }), async (req, res, next) => {
  await Timer.deleteMany();

  const { duration } = req.body;
  const timer = await Timer.create({
    createdAt: Date.now(),
    duration,
  });

  res.json(timer);
});

router.get('/pause', verifyToken({ isAdmin: true }), async (req, res, next) => {
  const timer = await Timer.findOne();

  if (timer.paused) return res.status(400).json({ error: 'Timer already paused' });

  timer.paused = true;
  timer.pausedAt = Date.now();
  await timer.save();

  res.json({ message: 'Timer paused' });
});

router.get('/resume', verifyToken({ isAdmin: true }), async (req, res, next) => {
  const timer = await Timer.findOne();

  if (!timer.paused) return res.status(400).json({ error: 'Timer is not paused' });

  timer.paused = false;
  timer.duration += Date.now() - timer.pausedAt;
  await timer.save();

  res.json({ message: 'Timer resumed' });
});

router.post('/stop', verifyToken({ isAdmin: true }), async (req, res, next) => {
  await Timer.deleteMany();

  res.json({ message: 'Timer stopped' });
});

module.exports = router;


