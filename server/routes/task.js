const fs = require('fs');
const path = require('path');
const bcrypt = require('bcrypt');
const router = require('express').Router();
const { Task, User, Timer } = require('../models');
const verifyToken = require('../helpers/verifyToken');

router.get('/', verifyToken(), async (req, res, next) => {
  const tasks = await Task.find();
  const user = await User.findById(req.userId);
  const timer = await Timer.findOne();

  if(!timer || (+timer.createdAt + timer.duration - Date.now()) < 0) {
    return res.json({ message: "Время вышло"})
  }

  if (req.isAdmin) {
    const tasksWithEnabled = tasks.map(task => ({
      ...task.toObject(),
      enabled: task.force > 0 || (+task.force === 0 && +timer.createdAt + +task.enableAfter < Date.now()),
    }));
  
    return res.json(tasksWithEnabled);
  }

  const solvedAllInititalTasks = tasks.every(task => {
    return task.enableAfter !== 0 || user.solvedTasks.indexOf(task._id) !== -1;
  });

  const parsedTasks = tasks.filter(task => {
    return task.force > 0 || solvedAllInititalTasks || (+task.force === 0 && (+task.enableAfter === 0 || +timer.createdAt + +task.enableAfter < Date.now()));
  }).map(task => {
    const { flag, ...noFlag } = task.toObject();

    return {
      ...noFlag,
      solved: user.solvedTasks.indexOf(task._id) !== -1,
    };
  });

  res.json(parsedTasks);
});

router.get('/scoreboard', verifyToken(), async (req, res, next) => {
  const scoreboard = {};

  try {
    const users = await User.find({ isAdmin: false });
    
    for (let i = 0; i < users.length; ++i) {
      let team = [];

      for (let j = 0; j < users[i].solvedTasks.length; ++j) {
        const task = await Task.findById(users[i].solvedTasks[j]);
        team.push({ title: task.title, points: task.points });
      }

      scoreboard[users[i].login] = team;
    }
  } catch (e) {
    res.json({ error: 'Oops, something went wrong!', details: e });
  }

  if (!req.isAdmin) {
    const simpleScoreboard = {};

    Object.keys(scoreboard).map(user => {
      simpleScoreboard[user] = scoreboard[user].reduce((score, task) => score + +task.points, 0);
    });

    return res.json({ scoreboard: simpleScoreboard });
  }

  res.json({ scoreboard });
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

  console.log((timer.createdAt + timer.duration) < Date.now())
  const { id: taskId } = req.params;
  const { flag } = req.body;
  const user = await User.findById(req.userId);

  if (user.solvedTasks.indexOf(taskId) !== -1) return res.status(400).json({ error: 'Task already solved' });

  const task = await Task.findById(taskId);

  if (task.force < 0 || timer.createdAt + task.enableAfter > Date.now()) return res.status(400).json({ error: 'Task in not currently enabled' });
  
  bcrypt.compare(flag, task.flag, async (err, correct) => {
    if (err) return res.status(401).json({ error: 'Submition failed' });
    else if (!correct) return res.status(400).json({ error: 'Wrong flag' });

    user.solvedTasks.push(task._id);
    await user.save();

    res.json({ solvedTask: task._id }); 
  });
});

router.post('/force',  verifyToken({ isAdmin: true }), async (req, res, next) => {
  const { force, taskId } = req.body;
  const task = await Task.findById(taskId);

  task.force = force;
  await task.save();

  res.json(task);
});

router.get('/migrate', verifyToken({ isAdmin: true }), async (req, res, next) => {
  const parsedTasks = JSON.parse(fs.readFileSync(path.join(__dirname, '../tasks.json')).toLocaleString());

  try {
    await Task.deleteMany();

    for (let i = 0; i < parsedTasks.length; ++i) {
      parsedTasks[i].flag = await bcrypt.hash(parsedTasks[i].flag, 10);
      await Task.create(parsedTasks[i]);
    }
  } catch (e) {
    return res.json({ error: 'Oops, something went wrong', details: e });
  }

  res.json({ message: 'Tasks migrate succesefully' });
});

module.exports = router;
