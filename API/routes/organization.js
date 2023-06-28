const OrganizationController = require("../controller/organization");
const Router = require("express-promise-router");
const router = new Router;


router.get('/', OrganizationController.findAll);
router.get('/:id', OrganizationController.findOne);

router.post('/', OrganizationController.create);

router.patch('/', OrganizationController.update);

router.delete('/:id', OrganizationController.delete);

/* router.get('/', OrganizationController.findAll);
router.get('/nameExists/:name', OrganizationController.nameExists);
router.get('/:email', OrganizationController.getOrganizationByEmail);
router.post('/', OrganizationController.postOrganization);
router.post('/emailExist', OrganizationController.emailExist);
router.patch('/', OrganizationController.updateOrganization);
router.delete('/:id', OrganizationController.deleteOrganization); */

module.exports = router;