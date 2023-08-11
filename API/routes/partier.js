const PartierController = require("../controller/partier");
const Router = require("express-promise-router");
const router = new Router;
const IdentificationJWT = require('../middleware/IdentificationJWT');
const Authorization = require('../middleware/Authorization');

/**
 * @swagger
 * /partier/:
 *  get:
 *      tags:
 *          - Partier
 *      security:
 *          - bearerAuth: []
 *      description: R�cup�re toutes les partiers
 *      responses:
 *          200:
 *              $ref: '#/components/responses/AllPartiersFound'
 *          403:
 *              $ref: '#/components/responses/mustBeAdmin'
 *          404:
 *              $ref: '#/components/responses/PartierNotFound'
 *          500:
 *              description: Erreur serveur
 */
router.get('/', IdentificationJWT.identification, Authorization.mustBeAdmin, PartierController.getAllPartiers);

router.get('/:id', IdentificationJWT.identification, Authorization.mustBeAdmin, PartierController.getPartier);

/**
 * @swagger
 *  /partier/:
 *      post:
 *          tags:
 *              - Partier
 *          security:
 *              - bearerAuth: []
 *          description: Cr�er un partier
 *          requestBody:
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/Partier'
 *          responses:
 *              201:
 *                  $ref: '#/components/responses/PartierCreated'
 *              403:
 *                  $ref: '#/components/responses/mustBeAdmin'
 *              400:
 *                  $ref: '#/components/responses/CreatePartierBadRequest'
 *              401:
 *                  $ref: '#/components/responses/UnauthorizedJWT'
 *              500:
 *                  description: Erreur serveur
 */
router.post('/', IdentificationJWT.identification, Authorization.mustBeAdmin, PartierController.postPartier);

/**
 * @swagger
 *  /partier/:
 *      patch:
 *          tags:
 *              - Partier
 *          security:
 *              - bearerAuth: []
 *          description: Met � jour un partier
 *          requestBody:
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/Partier'
 *          responses:
 *              200:
 *                  $ref: '#/components/responses/PartierUpdated'
 *              403:
 *                  $ref: '#/components/responses/mustBeAdminOrPartier'
 *              400:
 *                  $ref: '#/components/responses/PartierIdNotANumber'
 *              401:
 *                  $ref: '#/components/responses/UnauthorizedJWT'
 *              404:
 *                  $ref: '#/components/responses/PartierNotFound'
 *              500:
 *                  description: Erreur serveur
 */
router.patch('/', IdentificationJWT.identification, Authorization.mustBeAdminOrPartier, PartierController.updatePartier);

/**
 * @swagger
 *  /partier/{id}:
 *      delete:
 *          tags:
 *              - Partier
 *          security:
 *              - bearerAuth: []
 *          description: Supprime un partier
 *          parameters:
 *              - name: id
 *                description: id du partier
 *                in: path
 *                required: true
 *                schema:
 *                   type: integer
 *          responses:
 *              204:
 *                  $ref: '#/components/responses/PartierDeleted'
 *              403:
 *                  $ref: '#/components/responses/mustBeAdmin'
 *              400:
 *                  $ref: '#/components/responses/PartierIdNotANumber'
 *              401:
 *                  $ref: '#/components/responses/UnauthorizedJWT'
 *              404:
 *                  $ref: '#/components/responses/PartierNotFound'
 *              500:
 *                  description: Erreur serveur
 */
router.delete('/:id', IdentificationJWT.identification, Authorization.mustBeAdmin, PartierController.deletePartier);

module.exports = router;
