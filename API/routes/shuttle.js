const ShuttleController = require("../controller/shuttle");
const Router = require("express-promise-router");
const router = new Router;

router.get('/all', ShuttleController.getShuttles);

module.exports = router;
 