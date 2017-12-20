'use strict';

const Router = require('xiaolan-router');

let router = new Router();

router.get('/status', 'getTaskInfo');
router.post('/hook', 'hook');
module.exports = router.map();
