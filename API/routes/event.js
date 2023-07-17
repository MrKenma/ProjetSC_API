const EventController = require('../controller/event');
const Router = require('express-promise-router');
const router = new Router;

const Authorization = require('../middleware/Authorization');
const IdentificationJWT = require('../middleware/IdentificationJWT');

router.get('/', IdentificationJWT.identification, Authorization.mustBeAdminOrOrganizationOrPartier, EventController.getAllEvents);
router.get('/search/:id', IdentificationJWT.identification, Authorization.mustBeAdminOrOrganizationOrPartier , EventController.search);
router.get('/organization/:id', IdentificationJWT.identification, Authorization.mustBeAdminOrOrganization, EventController.getEventsByOrganization);
router.get('/:id', IdentificationJWT.identification, Authorization.mustBeAdminOrOrganization, EventController.getEvent);
router.get('/nameExists/:name', IdentificationJWT.identification, Authorization.mustBeAdminOrOrganization, EventController.nameExists);

router.post('/', IdentificationJWT.identification, Authorization.mustBeAdminOrOrganization, EventController.postEvent);
router.patch('/', IdentificationJWT.identification, Authorization.mustBeAdmin, EventController.updateEvent);
router.delete('/:id', IdentificationJWT.identification, Authorization.mustBeAdmin, EventController.deleteEvent);

module.exports = router;