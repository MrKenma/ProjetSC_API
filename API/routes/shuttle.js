const ShuttleController = require("../controller/shuttle");
const Router = require("express-promise-router");
const router = new Router;

/* router.get('/all', ShuttleController.findAll); */

router.get('/', ShuttleController.findAll);
router.get('/event/:id', ShuttleController.findByEvent);


module.exports = router;
 