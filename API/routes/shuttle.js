const ShuttleController = require("../controller/shuttle");
const Router = require("express-promise-router");
const router = new Router;

const IdentificationJWT = require('../middleware/IdentificationJWT');
const Authorization = require('../middleware/Authorization');

/* router.get('/all', ShuttleController.findAll); */

// add auth and id  to all routes

/**
 * @swagger
 * /:
 *  get:
 *      tags:
 *          - Shuttles
 *      security:
 *          - bearerAuth: []
 *      description: Récupère la liste de toutes les navettes.
 *      responses:
 *          200:
 *              $ref: '#/components/responses/AllShuttlesFound'
 *          401:
 *              $ref: '#/components/responses/UnauthorizedJWT'
 *          500:
 *              description: Erreur serveur
 */
router.get('/', IdentificationJWT.identification, Authorization.mustBeAdminOrPartier, ShuttleController.getAllShuttles);

/**
 * @swagger
 * /searchByDetails/{eventid}/{destinationtown}/{destinationzipcode}:
 *  get:
 *      tags:
 *          - Shuttles
 *      security:
 *          - bearerAuth: []
 *      description: Recherche des navettes en fonction de la ville et du code postal de destination.
 *      parameters:
 *          - name: "eventid"
 *            in: "path"
 *            description: "ID de l'événement dont on cherche les navettes."
 *            required: true
 *            type: "string"
 *          - name: "destinationtown"
 *            in: "path"
 *            description: "Nom de la ville de destination"
 *            required: true
 *            type: "string"
 *          - name: "destinationzipcode"
 *            in: "path"
 *            description: "Code postal de la ville de destination."
 *            required: true
 *            type: "string"
 *      responses:
 *          200:
 *              $ref: '#/components/responses/ShuttlesByDetailsFound'
 *          401:
 *              $ref: '#/components/responses/UnauthorizedJWT'
 *          500:
 *              description: Erreur serveur
 */
router.get('/searchByDetails/:eventid/:destinationtown/:destinationzipcode', IdentificationJWT.identification, Authorization.mustBeAdminOrPartier, ShuttleController.searchByDetails);


/**
 * @swagger
 * /searchByPartier/{partierid}:
 *  get:
 *      tags:
 *          - Shuttles
 *      security:
 *          - bearerAuth: []
 *      description: Recherche des navettes en fonction de l'ID du partier.
 *      parameters:
 *          - name: "partierid"
 *            in: "path"
 *            description: "ID du partier pour lequel on recherche les navettes."
 *            required: true
 *            type: "string"
 *      responses:
 *          200:
 *              $ref: '#/components/responses/ShuttlesByPartierFound'
 *          401:
 *              $ref: '#/components/responses/UnauthorizedJWT'
 *          500:
 *              description: Erreur serveur
 */
router.get('/searchByPartier/:partierid', IdentificationJWT.identification, Authorization.mustBeAdminOrPartier, ShuttleController.searchByPartier);

module.exports = router;