const ShuttleController = require("../controller/shuttle");
const Router = require("express-promise-router");
const router = new Router;

/* router.get('/all', ShuttleController.findAll); */

router.get('/', ShuttleController.findAll);
router.get('/search', ShuttleController.search);
router.get('/search2', ShuttleController.search2);


module.exports = router;
 