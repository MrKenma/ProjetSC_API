const TownController = require('../controller/town');
const Router = require('express-promise-router');
const router = new Router;

router.get('/', TownController.findAll);
//router.post('/', TownController.create);



module.exports = router;