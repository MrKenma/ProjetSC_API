const OrganizationController = require("../controller/organization");
const Router = require("express-promise-router");
const router = new Router;

const IdentificationJWT = require('../middleware/IdentificationJWT');
const Authorization = require('../middleware/Authorization');


router.get('/', IdentificationJWT.identification, Authorization.mustBeAdmin, OrganizationController.findAll);

router.post('/', IdentificationJWT.identification, Authorization.mustBeAdmin, OrganizationController.create);

router.patch('/', IdentificationJWT.identification, Authorization.mustBeAdmin, OrganizationController.update);

router.delete('/:id', IdentificationJWT.identification, Authorization.mustBeAdmin, OrganizationController.delete);

/* router.get('/', OrganizationController.findAll);
router.get('/nameExists/:name', OrganizationController.nameExists);
router.get('/:email', OrganizationController.getOrganizationByEmail);
router.post('/', OrganizationController.postOrganization);
router.post('/emailExist', OrganizationController.emailExist);
router.patch('/', OrganizationController.updateOrganization);
router.delete('/:id', OrganizationController.deleteOrganization); */

module.exports = router;