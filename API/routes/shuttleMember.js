const ShuttleMemberController = require("../controller/shuttleMember");
const Router = require("express-promise-router");
const router = new Router;

const IdentificationJWT = require('../middleware/IdentificationJWT');
const Authorization = require('../middleware/Authorization');

/**
 * @swagger
 * /shuttleMember/signup/:
 *   post:
 *     tags:
 *       - ShuttleMember
 *     security:
 *       - bearerAuth: []
 *     description: Inscription d'un partier à une navette
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ShuttleMemberSignUp'
 *     responses:
 *       201:
 *         $ref: '#/components/schemas/ShuttleMemberSignedUp'
 *       400:
 *         $ref: '#/components/responses/ShuttleMemberSignUpBadRequest'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedJWT'
 *       403:
 *         $ref: '#/components/responses/mustBeAdmin'
 *       500:
 *         description: Erreur serveur
 */
router.post('/signup', IdentificationJWT.identification, Authorization.mustBeAdminOrPartier, ShuttleMemberController.signup);

/**
 * @swagger
 * /shuttleMember/:
 *   patch:
 *     tags:
 *       - ShuttleMember
 *     security:
 *       - bearerAuth: []
 *     description: Mettre à jour les informations d'un membre de la navette
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateShuttleMember'
 *     responses:
 *       200:
 *               $ref: '#/components/schemas/ShuttleMemberUpdated'
 *       400:
 *         $ref: '#/components/responses/ShuttleMemberIdNotANumber'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedJWT'
 *       403:
 *         $ref: '#/components/responses/mustBeAdmin'
 *       404:
 *         $ref: '#/components/responses/ShuttleMemberNotFound'
 *       500:
 *         description: Erreur serveur
 */
router.patch('/', IdentificationJWT.identification, Authorization.mustBeAdminOrPartier, ShuttleMemberController.updateShuttleMember);

/**
 * @swagger
 * /cancel/{shuttleid}/{partierid}:
 *   delete:
 *     tags:
 *       - ShuttleMember
 *     security:
 *       - bearerAuth: []
 *     description: Supprimer l'inscriptiob d'un partier à une navette
 *     parameters:
 *       - name: shuttleid
 *         in: path
 *         description: id de la navette
 *         required: true
 *         schema:
 *           type: integer
 *       - name: partierid
 *         in: path
 *         description: id du partier (membre de la navette)
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         $ref: '#/components/responses/ShutterMemberDeleted'
 *       400:
 *         $ref: '#/components/responses/ShuttleOrMemberIdNotANumber'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedJWT'
 *       403:
 *         $ref: '#/components/responses/mustBeAdminOrOrganizationOrPartier'
 *       404:
 *         $ref: '#/components/responses/ShuttleOrMemberNotFound'
 *       500:
 *         description: Erreur serveur
 */
router.delete('/cancel/:shuttleid/:partierid', IdentificationJWT.identification, Authorization.mustBeAdminOrPartier, ShuttleMemberController.cancel);

/**
 * @swagger
 * /partier/{partierid}:
 *   delete:
 *     tags:
 *       - ShuttleMember
 *     security:
 *       - bearerAuth: []
 *     description: Supprimer toutes les inscriptions aux navette d'un partier
 *     parameters:
 *       - name: partierid
 *         in: path
 *         description: id du partier
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         $ref: '#/components/responses/ShutterSignUpsDeleted'
 *       400:
 *         $ref: '#/components/responses/ShuttleMemberIdNotANumber'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedJWT'
 *       403:
 *         $ref: '#/components/responses/mustBeAdminOrOrganizationOrPartier'
 *       404:
 *         $ref: '#/components/responses/ShuttleMemberNotFound'
 *       500:
 *         description: Erreur serveur
 */
router.delete('/partier/:partierid', IdentificationJWT.identification, Authorization.mustBeAdminOrPartier, ShuttleMemberController.deleteAllByPartier);

module.exports = router;
