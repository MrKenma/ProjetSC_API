const UserController = require('../controller/user');
const Router = require('express-promise-router');
const multer = require('multer');

const Authorization = require('../middleware/Authorization');
const IdentificationJWT = require('../middleware/IdentificationJWT');

const router = new Router;

const storage = multer.memoryStorage();
const upload = multer({ 
    limits: { fileSize: 700000 },
    storage: storage 
});

router.get('/login', UserController.login);
router.get('/emailExists/:email', UserController.emailExists);
router.get('/pseudoExists/:pseudo', UserController.pseudoExists);

router.get('/', IdentificationJWT.identification, Authorization.mustBeAdmin, UserController.findAll);
router.get('/:id', UserController.findOne);

router.post('/', UserController.create);

router.patch('/', UserController.update);
router.delete('/:id', UserController.delete);

router.post('/register', upload.fields([{name : "profilePicture", maxCount: 1}, {name : "proof", maxCount: 1}]), UserController.register);

// les route gets doivents avant la route '/:id' sinon express pense que par exemple login est un input de :id donc 400 car login is not a number

module.exports = router;