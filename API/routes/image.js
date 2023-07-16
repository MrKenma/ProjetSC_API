const ImageController = require('../controller/image');
const Router = require('express-promise-router');
const router = new Router;

const IdentificationJWT = require('../middleware/IdentificationJWT');
const Authorization = require('../middleware/Authorization');

router.get('/:email', IdentificationJWT.identification, Authorization.mustBeAdminOrOrganizationOrPartier, ImageController.getUuidFromEmail);

module.exports = router;