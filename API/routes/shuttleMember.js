const ShuttleMemberController = require("../controller/shuttleMember");
const Router = require("express-promise-router");
const router = new Router;

router.get('/', ShuttleMemberController.findAll);


module.exports = router;
