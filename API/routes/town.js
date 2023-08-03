const TownController = require('../controller/town');
const Router = require('express-promise-router');
const router = new Router;

const IdentificationJWT = require('../middleware/IdentificationJWT');
const Authorization = require('../middleware/Authorization');

// Attention : si auth et id, ça va générer des erreurs dans l'app au moment du register car pas de token à ce moment là
/**
 * @swagger
 * /:
 *   get:
 *     tags:
 *       - Town
 *     description: Récupérer toutes les villes
 *     responses:
 *       200:
 *         $ref: '#/components/responses/AllTownsFound'
 *       500:
 *         description: Erreur serveur
 */

router.get('/', TownController.getAllTowns);



module.exports = router;
