const PartierController = require("../controller/partier");
const Router = require("express-promise-router");
const router = new Router;

const IdentificationJWT = require('../middleware/IdentificationJWT');
const Authorization = require('../middleware/Authorization');

router.get('/', IdentificationJWT.identification, Authorization.mustBeAdmin, PartierController.getAllPartiers);

router.post('/', IdentificationJWT.identification, Authorization.mustBeAdmin, PartierController.postPartier);

router.patch('/', IdentificationJWT.identification, Authorization.mustBeAdminOrPartier, PartierController.updatePartier);

router.delete('/:id', IdentificationJWT.identification, Authorization.mustBeAdmin, PartierController.deletePartier);

/* router.post('/emailExists', PartierController.emailExists);
router.get('/getPartier/:id', PartierController.getPartier);
router.get('/:email', PartierController.getPartierByEmail);
router.post('/', PartierController.postPartier);
router.post('/emailExists', PartierController.emailExists);
router.patch('/', PartierController.updatePartier);
router.patch('/updateAddress', PartierController.updateAddress)
router.delete('/:id', PartierController.deletePartier); */

module.exports = router;
