const ShuttleController = require("../controller/shuttle");
const Router = require("express-promise-router");
const router = new Router;

const IdentificationJWT = require('../middleware/IdentificationJWT');
const Authorization = require('../middleware/Authorization');

/* router.get('/all', ShuttleController.findAll); */

// add auth and id  to all routes

router.get('/', IdentificationJWT.identification, Authorization.mustBeAdminOrPartier, ShuttleController.getAllShuttles);

router.get('/searchByDetails/:eventid/:destinationtown/:destinationzipcode', IdentificationJWT.identification, Authorization.mustBeAdminOrPartier, ShuttleController.searchByDetails);

router.get('/searchByPartier/:partierid', IdentificationJWT.identification, Authorization.mustBeAdminOrPartier, ShuttleController.searchByPartier);

module.exports = router;