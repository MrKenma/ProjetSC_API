const PartierController = require("../controller/partier");
const Router = require("express-promise-router");
const router = new Router;

router.get('/', PartierController.findAll);
router.get('/:id', PartierController.findOne);

router.post('/', PartierController.create);

router.patch('/', PartierController.update);

router.delete('/:id', PartierController.delete);

/* router.post('/emailExists', PartierController.emailExists);
router.get('/getPartier/:id', PartierController.getPartier);
router.get('/:email', PartierController.getPartierByEmail);
router.post('/', PartierController.postPartier);
router.post('/emailExists', PartierController.emailExists);
router.patch('/', PartierController.updatePartier);
router.patch('/updateAddress', PartierController.updateAddress)
router.delete('/:id', PartierController.deletePartier); */

module.exports = router;
