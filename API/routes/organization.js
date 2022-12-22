const OrganizationController = require("../controller/organization");
const Router = require("express-promise-router");
const router = new Router;

router.get('/getOrga/:id', OrganizationController.getOrganization);
router.get('/all', OrganizationController.getOrganizations);
router.get('/nameExists', OrganizationController.nameAlreadyExists);
router.get('/:email', OrganizationController.getOrganizationByEmail);
router.post('/', OrganizationController.postOrganization);
router.post('/emailExist', OrganizationController.emailExist);
router.patch('/', OrganizationController.updateOrganization);
router.delete('/:id', OrganizationController.deleteOrganization);

const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer(
    {
        limits : {
            fileSize : 1000000
        },
        storage: storage
    }
);

router.post('/register', upload.fields([
    {name : 'email', maxCount : 1},
    {name : 'password', maxCount : 1},
    {name : 'name', maxCount : 1},
    {name : 'responsibleName', maxCount : 1},
    {name : 'phoneNumber', maxCount : 1},
    {name : 'administrativeProof', maxCount : 1}
]) , OrganizationController.registerOrganization);

module.exports = router;