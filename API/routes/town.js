const TownController = require('../controller/town');
const Router = require('express-promise-router');
const router = new Router;

const IdentificationJWT = require('../middleware/IdentificationJWT');
const Authorization = require('../middleware/Authorization');

// Attention : si auth et id, ça va générer des erreurs dans l'app au moment du register car pas de token à ce moment là

router.get('/', TownController.getAllTowns);
router.get('/exists', IdentificationJWT.identification, Authorization.mustBeAdmin, TownController.townExists);
router.post('/', IdentificationJWT.identification, Authorization.mustBeAdmin, TownController.postTown);

module.exports = router;
