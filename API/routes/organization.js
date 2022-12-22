const OrganizationController = require("../controller/organization");
const Router = require("express-promise-router");
const router = new Router;

router.get('/all', OrganizationController.getOrganizations);
router.post('/emailExist', OrganizationController.emailExist);
router.get('/:email', OrganizationController.getOrganizationByEmail);

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

/* router.get('/:id', OrganizationController.getOrganization);
router.post('/', OrganizationController.postOrganization);
router.patch('/', OrganizationController.updateOrganization);
router.delete('/:id', OrganizationController.deleteOrganization); */

module.exports = router;