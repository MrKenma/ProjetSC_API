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

router.get('/', IdentificationJWT.identification, Authorization.mustBeAdmin, UserController.getAllUsers);

router.get('/:id', IdentificationJWT.identification, Authorization.mustBeAdmin, UserController.getUser);

router.post('/register', upload.fields([{ name: "profilePicture", maxCount: 1 }, { name: "proof", maxCount: 1 }]), UserController.register);

router.post('/', IdentificationJWT.identification, Authorization.mustBeAdmin, UserController.postUser);

router.patch('/', IdentificationJWT.identification, Authorization.mustBeAdmin, UserController.updateUser);

router.delete('/:id', IdentificationJWT.identification, Authorization.mustBeAdmin, UserController.deleteUser);

// les route gets doivents avant la route '/:id' sinon express pense que par exemple login est un input de :id donc 400 car login is not a number

module.exports = router;