const ShuttleMemberController = require("../controller/shuttleMember");
const Router = require("express-promise-router");
const router = new Router;

router.get('/', ShuttleMemberController.findAll);
router.post('/signup', ShuttleMemberController.signup);
router.patch('/', ShuttleMemberController.update);

router.delete('/cancel/:shuttleid/:partierid', ShuttleMemberController.cancel);
router.delete('/partier/:partierid', ShuttleMemberController.deleteAllByPartier);

module.exports = router;
