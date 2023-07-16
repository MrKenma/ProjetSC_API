const ShuttleMemberController = require("../controller/shuttleMember");
const Router = require("express-promise-router");
const router = new Router;

const IdentificationJWT = require('../middleware/IdentificationJWT');
const Authorization = require('../middleware/Authorization');

router.get('/', IdentificationJWT.identification, Authorization.mustBeAdminOrPartier, ShuttleMemberController.findAll);

router.post('/signup', IdentificationJWT.identification, Authorization.mustBeAdminOrPartier, ShuttleMemberController.signup);

router.patch('/', IdentificationJWT.identification, Authorization.mustBeAdminOrPartier, ShuttleMemberController.update);

router.delete('/cancel/:shuttleid/:partierid', IdentificationJWT.identification, Authorization.mustBeAdminOrPartier, ShuttleMemberController.cancel);
router.delete('/partier/:partierid', IdentificationJWT.identification, Authorization.mustBeAdminOrPartier, ShuttleMemberController.deleteAllByPartier);

module.exports = router;
