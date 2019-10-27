const router = require('express').Router();
const authController = require('./auth');
const taskController = require('./task');
const timerContoller = require('./timer');

router.use('/auth', authController);
router.use('/task', taskController);
router.use('/timer', timerContoller);

module.exports = router;

