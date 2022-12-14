const EventController = require("../controller/eventDB");
const Router = require("express-promise-router");
const router = new Router;

router.get('/events', EventController.getEvents);
router.get('/:id', EventController.getEvent);
//router.get('/get/responsibles', eventController.getUniquesResponsiblesNames);
//router.get('/get/events/:responsibleName', eventController.geteventsByResponsibleName);
router.post('/', EventController.postEvent);
router.patch('/', EventController.updateEvent);
router.delete('/:id', EventController.deleteEvent);

module.exports = router;
