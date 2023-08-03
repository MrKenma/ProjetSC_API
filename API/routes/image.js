const ImageController = require('../controller/image');
const Router = require('express-promise-router');
const router = new Router;

const IdentificationJWT = require('../middleware/IdentificationJWT');
const Authorization = require('../middleware/Authorization');

/**
 * @swagger
 * components:
 *  responses:
 *      ImageUuidFound:
 *          description: Renvoie l'UUID de l'image associ�e � l'adresse e-mail sp�cifi�e
 *  parameters:
 *      email:
 *          name: email
 *          in: path
 *          description: Adresse e-mail pour laquelle r�cup�rer l'UUID de l'image
 *          required: true
 *          schema:
 *              type: string
 *  security:
 *      - bearerAuth: []
 *  /image/{email}:
 *      get:
 *          tags:
 *              - Image
 *          security:
 *              - bearerAuth: []
 *          description: R�cup�re l'UUID de l'image associ�e � l'adresse e-mail sp�cifi�e
 *          parameters:
 *              - $ref: '#/components/parameters/email'
 *          responses:
 *              200:
 *                  $ref: '#/components/responses/ImageUuidFound'
 *              401:
 *                  $ref: '#/components/responses/UnauthorizedJWT'
 *              403:
 *                  $ref: '#/components/responses/mustBeAdminOrOrganizationOrPartier'
 *              404:
 *                  $ref: '#/components/responses/PartierNotFound'
 *              500:
 *                  description: Erreur serveur
 */
router.get('/:email', IdentificationJWT.identification, Authorization.mustBeAdminOrOrganizationOrPartier, ImageController.getUuidFromEmail);

module.exports = router;