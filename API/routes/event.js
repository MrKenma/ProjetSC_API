const EventController = require('../controller/event');
const Router = require('express-promise-router');
const router = new Router;

const Authorization = require('../middleware/Authorization');
const IdentificationJWT = require('../middleware/IdentificationJWT');

router.get('/', EventController.findAll);
router.get('/search', EventController.search);
router.get('/organization/:id', EventController.findManyByOrganization);
router.get('/:id', EventController.findOne);
router.get('/nameExists/:name', EventController.nameExists);

router.post('/', EventController.create);
router.patch('/', EventController.update);
router.delete('/:id', EventController.delete);

module.exports = router;