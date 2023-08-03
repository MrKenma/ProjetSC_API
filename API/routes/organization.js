const OrganizationController = require("../controller/organization");
const Router = require("express-promise-router");
const router = new Router;

const IdentificationJWT = require('../middleware/IdentificationJWT');
const Authorization = require('../middleware/Authorization');


/**
 * @swagger
 * /organization/:
 *  get:
 *      tags:
 *          - Organization
 *      security:
 *          - bearerAuth: []
 *      description: Récupère toutes les organisations
 *      responses:
 *          200:
 *              $ref: '#/components/responses/AllOrganizationsFound'
 *          401:
 *              $ref: '#/components/responses/UnauthorizedJWT'
 *          403:
 *              $ref: '#/components/responses/mustBeAdmin'
 *          404:
 *              $ref: '#/components/responses/OrganizationNotFound'
 *          500:
 *              description: Erreur serveur
 */

router.get('/', IdentificationJWT.identification, Authorization.mustBeAdmin, OrganizationController.getAllOrganizations);

/**
 * @swagger
 *  /organization/:
 *      post:
 *          tags:
 *              - Organization
 *          security:
 *              - bearerAuth: []
 *          description: Créer une organisation
 *          requestBody:
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/CreateOrganization'
 *          responses:
 *              201:
 *                  $ref: '#/components/responses/OrganizationCreated'
 *              400:
 *                  $ref: '#/components/responses/CreateOrganizationBadRequest'
 *              401:
 *                  $ref: '#/components/responses/UnauthorizedJWT'
 *              403:
 *                  $ref: '#/components/responses/mustBeAdmin'
 *              500:
 *                  description: Erreur serveur
 */

router.post('/', IdentificationJWT.identification, Authorization.mustBeAdmin, OrganizationController.postOrganization);

/**
 * @swagger
 *  /organization/:
 *      patch:
 *          tags:
 *              - Organization
 *          security:
 *              - bearerAuth: []
 *          description: Met à jour une organisation
 *          requestBody:
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/UpdateOrganization'
 *          responses:
 *              200:
 *                  $ref: '#/components/responses/OrganizationUpdated'
 *              400:
 *                  $ref: '#/components/responses/OrganizationIdNotANumber'
 *              401:
 *                  $ref: '#/components/responses/UnauthorizedJWT'
 *              403:
 *                  $ref: '#/components/responses/mustBeAdmin'
 *              404:
 *                  $ref: '#/components/responses/OrganizationNotFound'
 *              500:
 *                  description: Erreur serveur
 */

router.patch('/', IdentificationJWT.identification, Authorization.mustBeAdmin, OrganizationController.updateOrganization);

/**
 * @swagger
 *  /organization/{id}:
 *      delete:
 *          tags:
 *              - Organization
 *          security:
 *              - bearerAuth: []
 *          description: Supprime une organisation
 *          parameters:
 *              - name: id
 *                description: id de l'organisation
 *                in: path
 *                required: true
 *                schema:
 *                   type: integer
 *          responses:
 *              204:
 *                  $ref: '#/components/responses/OrganizationDeleted'
 *              400:
 *                  $ref: '#/components/responses/OrganizationIdNotANumber'
 *              401:
 *                  $ref: '#/components/responses/UnauthorizedJWT'
 *              403:
 *                  $ref: '#/components/responses/mustBeAdmin'
 *              404:
 *                  $ref: '#/components/responses/OrganizationNotFound'
 *              500:
 *                  description: Erreur serveur
 */

router.delete('/:id', IdentificationJWT.identification, Authorization.mustBeAdmin, OrganizationController.deleteOrganization);


module.exports = router;