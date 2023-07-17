const OrganizationController = require("../controller/organization");
const Router = require("express-promise-router");
const router = new Router;

const IdentificationJWT = require('../middleware/IdentificationJWT');
const Authorization = require('../middleware/Authorization');


router.get('/', IdentificationJWT.identification, Authorization.mustBeAdmin, OrganizationController.getAllOrganizations);

router.post('/', IdentificationJWT.identification, Authorization.mustBeAdmin, OrganizationController.postOrganization);

router.patch('/', IdentificationJWT.identification, Authorization.mustBeAdmin, OrganizationController.updateOrganization);

router.delete('/:id', IdentificationJWT.identification, Authorization.mustBeAdmin, OrganizationController.deleteOrganization);


module.exports = router;