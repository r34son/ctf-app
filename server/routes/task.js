const bcrypt = require('bcrypt');
const router = require('express').Router();
const { Task, User, Timer } = require('../models');
const verifyToken = require('../helpers/verifyToken');

router.get('/', verifyToken(), async (req, res, next) => {
  const tasks = await Task.find();
  const user = await User.findById(req.userId);
  const timer = await Timer.findOne();

  const solvedAllInititalTasks = tasks.every(task => {
    return task.enableAfter !== 0 || user.solvedTasks.indexOf(task._id) !== -1;
  });

  const parsedTasks = tasks.filter(task => {
    return task.forceValue > 0 || solvedAllInititalTasks || task.forceEnabled || (timer.createdAt + task.enableAfter < Date.now());
  }).map(task => {
    return {
      ...task,
      solved: user.solvedTasks.indexOf(task._id) !== -1,
    };
  });

  res.json(parsedTasks);
});

router.post('/add', verifyToken({ isAdmin: true }), async (req, res, next) => {
  const { title, description, flag, category, points, enableAfter = 0 } = req.body;

  try {
    const hash = await bcrypt.hash(flag, 10);
    const task = await Task.create({
      title,
      description,
      flag: hash,
      category,
      points,
      enableAfter,
    });

    res.json(task);
  } catch (err) {
    res.status(400).json(err);
  }
});

router.post('/submit/:id', verifyToken(), async (req, res, next) => {
  const timer = await Timer.findOne();

  if (!timer || timer.paused || (timer.createdAt + timer.duration) < Date.now()) return res.status(400).json({ error: 'Flags are not currenty accepted' });

  const { id: taskId } = req.params;
  const { flag } = req.body;
  const user = await User.findById(req.userId);

  if (user.solvedTasks.indexOf(taskId) !== -1) return res.status(400).json({ error: 'Task already solved' });

  const task = await Task.findById(taskId);

  if (task.forceValue === -1 || timer.createdAt + task.enableAfter > Date.now()) return res.status(400).json({ error: 'Task in not currently enabled' });
  
  bcrypt.compare(flag, task.flag, (err, correct) => {
    if (err) return res.status(401).json({ error: 'Submition failed' });
    else if (!correct) return res.status(400).json({ error: 'Wrong flag' });

    user.solvedTasks.push(task._id);
    await user.save();

    res.json({ solvedTask: task._id }); 
  });
});

router.post('/force',  verifyToken({ isAdmin: true }), async (req, res, next) => {
  const { forceValue, taskId } = req.body;
  const task = await Task.findById(taskId);

  task.forceValue = forceValue;
  await task.save();

  res.json(task);
});

module.exports = router;
