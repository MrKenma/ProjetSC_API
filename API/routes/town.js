const TownController = require('../controller/town');
const Router = require('express-promise-router');
const router = new Router;

router.get('/all', TownController.getTowns);

module.exports = router;