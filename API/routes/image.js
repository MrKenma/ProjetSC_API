const ImageController = require('../controller/image');
const Router = require('express-promise-router');
const router = new Router;

router.get('/:email', ImageController.getUuidFromEmail);

module.exports = router;