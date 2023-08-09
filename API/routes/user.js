const UserController = require('../controller/user');
const Router = require('express-promise-router');
const multer = require('multer');

const Authorization = require('../middleware/Authorization');
const IdentificationJWT = require('../middleware/IdentificationJWT');

const router = new Router;

const storage = multer.memoryStorage();
const upload = multer({
    limits: { fileSize: 10000000 },
    storage: storage
});

/**
 * @swagger
 * /login:
 *   get:
 *     tags:
 *       - User
 *     description: Authentification de l'utilisateur
 *     responses:
 *       200:
 *         $ref: '#/components/schemas/AuthorizedJWT'
 *       401:
 *         $ref: '#/components/schemas/UnauthorizedJWT'
 *       500:
 *         description: Erreur serveur
 */
router.get('/login', UserController.login);

/**
 * @swagger
 * /emailExists/{email}:
 *   get:
 *     tags:
 *       - User
 *     description: Vérifier si l'adresse email existe déjà dans la BD
 *     parameters:
 *       - name: email
 *         in: path
 *         description: Adresse e-mail à vérifier
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Statut de la présence de l'email dans la BD
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 exists:
 *                   type: boolean
 *                   description: Indique si l'adresse e-mail existe déjà
 *       500:
 *         description: Erreur serveur
 */
router.get('/emailExists/:email', UserController.emailExists);

/**
 * @swagger
 * /pseudoExists/{pseudo}:
 *   get:
 *     tags:
 *       - User
 *     description: Vérifier si le pseudo existe déjà dans la BD
 *     parameters:
 *       - name: pseudo
 *         in: path
 *         description: Pseudo à vérifier
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Statut de la présence du pseudo dans la BD
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 exists:
 *                   type: boolean
 *                   description: Indique si le pseudo existe déjà
 *       500:
 *         description: Erreur serveur
 */
router.get('/pseudoExists/:pseudo', UserController.pseudoExists);

/**
* @swagger
* /user/:
*   get:
*     tags:
*       - User
*     security:
*       - bearerAuth: []
*     description: Récupérer tous les utilisateurs
*     responses:
*       200:
*         $ref: '#/components/responses/AllUsersFound'
*       401:
*         $ref: '#/components/responses/UnauthorizedJWT'
*       403:
*         $ref: '#/components/responses/mustBeAdmin'
*       500:
*         description: Erreur serveur
*/
router.get('/', IdentificationJWT.identification, Authorization.mustBeAdmin, UserController.getAllUsers);

/**
 * @swagger
 * /user/{id}:
 *   get:
 *     tags:
 *       - User
 *     security:
 *       - bearerAuth: []
 *     description: Récupérer un utilisateur par son ID
 *     parameters:
 *       - name: id
 *         in: path
 *         description: id de l'utilisateur
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         $ref: '#/components/schemas/UserFound'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedJWT'
 *       403:
 *         $ref: '#/components/responses/mustBeAdmin'
 *       404:
 *         $ref: '#/components/responses/UserNotFound'
 *       500:
 *         description: Erreur serveur
 */
router.get('/:id', IdentificationJWT.identification, Authorization.mustBeAdmin, UserController.getUser);

/**
 * @swagger
 * /user/register/:
 *   post:
 *     tags:
 *       - User
 *     description: Créer un nouvel utilisateur
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               profilePicture:
 *                 type: string
 *                 format: binary
 *                 description: Image de profil de l'utilisateur
 *               proof:
 *                 type: string
 *                 format: binary
 *                 description: Preuve d'identité de l'utilisateur
 *               otherProperty:
 *                 type: string
 *                 description: Autres propriétés du formulaire d'inscription
 *     responses:
 *       201:
 *         $ref: '#/components/responses/UserCreated'
 *       400:
 *         $ref: '#/components/responses/CreateUserBadRequest'
 *       500:
 *         description: Erreur serveur
 */
router.post('/register', upload.fields([{ name: "profilePicture", maxCount: 1 }, { name: "proof", maxCount: 1 }]), UserController.register);

/**
 * @swagger
 * /user/:
 *   post:
 *     tags:
 *       - User
 *     security:
 *       - bearerAuth: []
 *     description: Créer un nouvel administrateur
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateAdmin'
 *     responses:
 *       201:
 *         $ref: '#/components/schemas/AdminCreated'
 *       400:
 *         $ref: '#/components/responses/CreateAdminBadRequest'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedJWT'
 *       403:
 *         $ref: '#/components/responses/mustBeAdmin'
 *       500:
 *         description: Erreur serveur
 */
router.post('/', IdentificationJWT.identification, Authorization.mustBeAdmin, UserController.postUser);

/**
 * @swagger
 * /user/:
 *   patch:
 *     tags:
 *       - User
 *     security:
 *       - bearerAuth: []
 *     description: Met à jour un utilisateur
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateUser'
 *     responses:
 *       200:
 *         $ref: '#/components/schemas/UserUpdated'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedJWT'
 *       403:
 *         $ref: '#/components/responses/UserIdNotANumber'
 *       404:
 *         $ref: '#/components/responses/UserNotFound'
 *       500:
 *         description: Erreur serveur
 */
router.patch('/', IdentificationJWT.identification, Authorization.mustBeAdmin, UserController.updateUser);

/**
 * @swagger
 * /user/{id}:
 *   delete:
 *     tags:
 *       - User
 *     security:
 *       - bearerAuth: []
 *     description: Supprimer un utilisateur
 *     parameters:
 *       - name: id
 *         in: path
 *         description: id de l'utilisateur à supprimer
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         $ref: '#/components/responses/UserDeleted'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedJWT'
 *       403:
 *         $ref: '#/components/responses/mustBeAdmin'
 *       400:
 *         $ref: '#/components/responses/UserIdNotANumber'
 *       404:
 *         $ref: '#/components/responses/UserNotFound'
 *       500:
 *         description: Erreur serveur
 */
router.delete('/:id', IdentificationJWT.identification, Authorization.mustBeAdmin, UserController.deleteUser);

// les route gets doivents avant la route '/:id' sinon express pense que par exemple login est un input de :id donc 400 car login is not a number

module.exports = router;