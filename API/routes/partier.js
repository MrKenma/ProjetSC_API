const PartierController = require("../controller/partier");
const Router = require("express-promise-router");
const router = new Router;

router.get('/all', PartierController.getPartiers);
router.post('/emailExist', PartierController.emailExist);
router.get('/:email', PartierController.getPartierByEmail);

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
    {name: 'email', maxCount: 1},
    {name: 'pseudo', maxCount: 1},
    {name: 'password', maxCount: 1},
    {name: 'firstName', maxCount: 1},
    {name: 'lastName', maxCount: 1},
    {name: 'profilePicture', maxCount: 1},
    {name: 'phoneNumber', maxCount: 1},
    {name: 'refPhoneNumber', maxCount: 1},
    {name: 'addressTown', maxCount: 1},
    {name: 'addressZipCode', maxCount: 1}
]), PartierController.registerPartier);

router.post('/', PartierController.postPartier);

router.patch('/updateAddress', PartierController.updateAddress)

/*

router.patch('/', PartierController.updatePartier);
router.delete('/', PartierController.deletePartier); 

*/

module.exports = router;
