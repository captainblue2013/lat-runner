'use strict';

const Router = require('xiaolan-router');

let router = new Router();

router.get('/status', 'getTaskInfo');
router.post('/hook', 'hook');
router.post('/project','createProject');
router.get('/project','listProject');
module.exports = router;
