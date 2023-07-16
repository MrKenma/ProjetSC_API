const EventController = require('../controller/event');
const Router = require('express-promise-router');
const router = new Router;

const Authorization = require('../middleware/Authorization');
const IdentificationJWT = require('../middleware/IdentificationJWT');

router.get('/', IdentificationJWT.identification, Authorization.mustBeAdminOrOrganizationOrPartier, EventController.findAll);
router.get('/search/:id', IdentificationJWT.identification, Authorization.mustBeAdminOrOrganizationOrPartier , EventController.search);
router.get('/organization/:id', IdentificationJWT.identification, Authorization.mustBeAdminOrOrganization, EventController.findManyByOrganization);
router.get('/:id', IdentificationJWT.identification, Authorization.mustBeAdminOrOrganization, EventController.findOne);
router.get('/nameExists/:name', IdentificationJWT.identification, Authorization.mustBeAdminOrOrganization, EventController.nameExists);

router.post('/', IdentificationJWT.identification, Authorization.mustBeAdminOrOrganization, EventController.create);
router.patch('/', IdentificationJWT.identification, Authorization.mustBeAdmin, EventController.update);
router.delete('/:id', IdentificationJWT.identification, Authorization.mustBeAdmin, EventController.delete);

module.exports = router;