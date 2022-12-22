const EventController = require('../controller/event');
const Router = require('express-promise-router');
const router = new Router;

router.get('/all', EventController.getEvents);
router.get('/:id', EventController.getEvent);
router.get('/organization/:organizationId', EventController.getEventsByOrganization);
router.post('/', EventController.postEvent);
router.post('/town', EventController.getEventsByTown);
router.patch('/', EventController.updateEvent);
router.delete('/:id', EventController.deleteEvent);

module.exports = router;