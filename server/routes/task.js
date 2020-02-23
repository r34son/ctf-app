const bcrypt = require("bcrypt");
const router = require("express").Router();
const { Task, User, Timer } = require("../models");
const verifyToken = require("../helpers/verifyToken");

router.get("/", verifyToken(), async (req, res) => {
  const tasks = await Task.find();
  const user = await User.findById(req.userId);
  const timer = await Timer.findOne();
  const { duration, time } = timer;

  if (!req.isAdmin) {
    if (!timer || !time > 0) {
      return res.json({ message: "Время вышло" });
    }
  }

  const tasksWithEnabled = tasks.map(task => ({
    ...task.toObject(),
    enabled:
      task.force === 1 ||
      (task.force === 0 && duration - time >= task.enableAfter)
  }));

  if (req.isAdmin) {
    return res.json(tasksWithEnabled);
  }

  const solvedAllEnabledTasks = tasksWithEnabled
    .filter(task => task.enabled)
    .every(task => user.solvedTasks.includes(task._id));

  const parsedTasks = tasksWithEnabled
    .filter(task => task.enabled || solvedAllEnabledTasks)
    .map(task => {
      const { flag, enabled, ...noFlag } = task;

      return {
        ...noFlag,
        solved: user.solvedTasks.includes(task._id)
      };
    });

  res.json(parsedTasks);
});

router.get("/scoreboard", verifyToken(), async (req, res, next) => {
  const scoreboard = {};

  try {
    const users = await User.find({ isAdmin: false });
    // TEST IT
    // users.forEach(user => {
    //   scoreboard[user.login] = user.solvedTasks.map(async id => {
    //     const { title, points } = await Task.findById(id);
    //     return { title, points };
    //   });
    // });

    for (let i = 0; i < users.length; ++i) {
      let team = [];

      for (let j = 0; j < users[i].solvedTasks.length; ++j) {
        const task = await Task.findById(users[i].solvedTasks[j]);
        team.push({ title: task.title, points: task.points });
      }

      scoreboard[users[i].login] = team;
    }
  } catch (e) {
    return res.json({ error: "Oops, something went wrong!", details: e });
  }

  if (!req.isAdmin) {
    const simpleScoreboard = {};

    Object.keys(scoreboard).forEach(user => {
      simpleScoreboard[user] = scoreboard[user].reduce(
        (score, task) => score + task.points,
        0
      );
    });

    return res.json({ scoreboard: simpleScoreboard });
  }

  res.json({ scoreboard });
});

router.post("/add", verifyToken({ isAdmin: true }), async (req, res, next) => {
  const {
    title,
    description,
    flag,
    category,
    points,
    enableAfter = 0
  } = req.body;

  try {
    const hash = await bcrypt.hash(flag, 10);
    const task = await Task.create({
      title,
      description,
      flag: hash,
      category,
      points,
      enableAfter
    });

    res.json(task);
  } catch (err) {
    res.status(400).json(err);
  }
});

router.post("/submit/:taskId", verifyToken(), async (req, res, next) => {
  const timer = await Timer.findOne();
  const { duration, time } = timer;

  if (!timer || timer.state === "paused" || !time > 0)
    return res.status(400).json({ error: "Flags are not currenty accepted" });

  const { taskId } = req.params;
  const { flag } = req.body;
  const user = await User.findById(req.userId);

  if (user.solvedTasks.includes(taskId))
    return res.status(400).json({ error: "Task already solved" });

  const task = await Task.findById(taskId);

  if (task.force < 0 || duration - time <= task.enableAfter)
    return res.status(400).json({ error: "Task in not currently enabled" });

  bcrypt.compare(flag, task.flag, async (err, correct) => {
    if (err) return res.status(401).json({ error: "Submition failed" });
    else if (!correct) return res.status(400).json({ error: "Wrong flag" });

    user.solvedTasks.push(task._id);
    await user.save();

    res.json({ solvedTask: task._id });
  });
});

router.post("/force", verifyToken({ isAdmin: true }), async (req, res) => {
  const { force, taskId } = req.body;
  const task = await Task.findById(taskId);

  task.force = force;
  await task.save();

  res.json(task);
});

module.exports = router;
