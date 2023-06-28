const EventController = require('../controller/event');
const Router = require('express-promise-router');
const router = new Router;

router.get('/', EventController.findAll);
router.get('/:id', EventController.findOne);

router.post('/', EventController.create);
router.patch('/', EventController.update);
router.delete('/:id', EventController.delete);

module.exports = router;