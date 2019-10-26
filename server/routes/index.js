const path = require('path');
const router = require('express').Router();
const apiController = require('./api.js');

router.get('/', (_, res) => res.sendFile(path.join(__dirname, '../../build/index.html')));
router.use('/api', apiController);

module.exports = router;
