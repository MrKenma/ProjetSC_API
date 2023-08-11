const pool = require('../model/database');
const PartierModel = require('../model/partier');
const UserModel = require('../model/user');
const ShuttleMemberModel = require('../model/shuttleMember');
const ImageModel = require('../model/image');
const PartierORM = require('../ORM/model/partier');
const UserORM = require('../ORM/model/user');

/***************** CRUD for partier *****************/
/**
 * @swagger
 * components:
 *   schemas:
 *     Partier:
 *       type: object
 *       properties:
 *         userID:
 *           type: integer
 *           description: L'ID de l'utilisateur du Partier
 *         firstName:
 *           type: string
 *           description: Le prénom du Partier
 *         lastName:
 *           type: string
 *           description: Le nom de famille du Partier
 *         referencePhoneNumber:
 *           type: string
 *           description: Le numéro de téléphone de référence du Partier
 *         addressTown:
 *           type: string
 *           description: La ville de résidence du Partier
 *         addressZipCode:
 *           type: integer
 *           description: Le code postal de la résidence du Partier
 *       example:
 *         userID: 1
 *         firstName: "Jean"
 *         lastName: "Dupont"
 *         referencePhoneNumber: "0123456789"
 *         addressTown: "Paris"
 *         addressZipCode: 75001
 */

/**
 * @swagger
 * components:
 *  responses:
 *      AllPartiersFound:
 *          description: Récupère toutes les partiers
 */
module.exports.getAllPartiers = async (req, res) => {
    const client = await pool.connect();
    
    try {

        const partiers = await PartierORM.findAll({
            include: UserORM
        });

        if (partiers === undefined) {
            res.sendStatus(404);
            return;
        }

        res.json(partiers);

    } catch (error) {

        console.error(error);
        res.sendStatus(500);

    } finally {

        client.release();

    }
}

/**
 * @swagger
 * components:
 *  responses:
 *      PartierFound:
 *          description: Récupère un partier
 *      PartierNotFound:
 *          description: Le partier n'a pas été trouvé
 *      PartierIdNotANumber:
 *          description: L'id de l'organisation n'est pas un nombre
 *      CreatePartierBadRequest:
 *          description: Informations invalides pour créer un partier
 */
module.exports.getPartier = async (req, res) => {
    const client = await pool.connect();
    const id = req.params.id;

    try {

        if (isNaN(id)) {
            res.sendStatus(400);
            return;
        }

        const partier = await PartierORM.findByPk(id, {
            include: UserORM
        });

        if (partier === undefined) {
            res.sendStatus(404);
            return;
        }

        res.json(partier);

    } catch (error) {

        console.error(error);
        res.sendStatus(500);

    } finally {
        client.release();
    }
}

/**
 * @swagger
 * components:
 *  responses:
 *      PartierCreated:
 *          description: Le partier a été créé
 *      CreatePartierBadRequest:
 *          description: création impossible car l'un des paramètres n'est pas valable
 *  requestBodies:
 *      CreatePartier:
 *          description: Le partier à créer
 *          content:
 *              application/json:
 *                  schema:
 *                     $ref: '#/components/schemas/Organization'
 */
module.exports.postPartier = async (req, res) => {
    const client = await pool.connect();
    const { userID, firstName, lastName, referencePhoneNumber, addressTown, addressZipCode } = req.body;

    try {

        if (userID === undefined || firstName === undefined || lastName === undefined || referencePhoneNumber === undefined || addressTown === undefined || addressZipCode === undefined) {
            res.sendStatus(400);
            return;
        }

        await PartierModel.postPartier(userID, firstName, lastName, referencePhoneNumber, addressTown, addressZipCode, client);

        res.sendStatus(201);

    } catch (error) {
        console.error(error);
        res.sendStatus(500);
    } finally {
        client.release();
    }
}

/**
 * @swagger
 * components:
 *  responses:
 *      PartierUpdated:
 *          description: L'organisation a été mise à jour
 *      PartierNotFound:
 *          description: L'organisation n'a pas été trouvée
 *      PartierIdNotANumber:
 *          description: L'id du partier n'est pas un nombre
 *  requestBodies:
 *      PartierUpdated:
 *          description: Le partier à mettre à jour
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/Partier'
 */
module.exports.updatePartier = async (req, res) => {
    const client = await pool.connect();
    const userid  = parseInt(req.body.userid);

    try {

        if (isNaN(userid)) {
            res.sendStatus(400);
            return;
        }

        const {rows: partiers} = await PartierModel.getPartier(userid, client);

        const partier = partiers[0];

        if (partier === undefined) {
            res.sendStatus(404);
            return;
        }

        const {firstname, lastname, refphonenumber, addresstown, addresszipcode} = partier;

        const newFirstName = req.body.firstname === undefined ? firstname : req.body.firstname;
        const newLastName = req.body.lastname === undefined ? lastname : req.body.lastname;
        const newRefPhoneNumber = req.body.refphonenumber === undefined ? refphonenumber : req.body.refphonenumber;
        const newAddressTown = req.body.addresstown === undefined ? addresstown : req.body.addresstown;
        const newAddressZipCode = req.body.addresszipcode === undefined ? addresszipcode : req.body.addresszipcode;


        await PartierModel.updatePartier(userid, newFirstName, newLastName, newRefPhoneNumber, newAddressTown, newAddressZipCode, client);

        res.sendStatus(200);

    } catch (error) {
        console.error(error);
        res.sendStatus(500);
    } finally {
        client.release();
    }
}

/**
 * @swagger
 * components:
 *  responses:
 *      PartierDeleted:
 *          description: Le partier a été supprimé
 *      PartierNotFound:
 *          description: Le partier n'a pas été trouvé
 *      PartierIdNotANumber:
 *          description: L'id du partier n'est pas un nombre
 */
module.exports.deletePartier = async (req, res) => {

    const client = await pool.connect();
    const userID = req.params.id;

    try {

        await client.query('BEGIN');
        
        if (isNaN(userID)) {
            res.sendStatus(400);
            return;
        }

        const {rows: partiers} = await PartierModel.getPartier(userID, client);
        const partier = partiers[0];
        const {rows: users} = await UserModel.getUser(userID, client);
        const user = users[0];

        if (partier === undefined || user === undefined) {
            res.sendStatus(404);
            return;
        }

        if (user.hasuploadedprofilepicture) {
            await ImageModel.deleteFile("./public/profile_picture", user.email, "jpeg");
        }

        await ShuttleMemberModel.deleteAllByPartier(userID, client);
        await PartierModel.deletePartier(userID, client);
        await UserModel.deleteUser(userID, client);

        await client.query('COMMIT');
        res.sendStatus(204);
       
    } catch (error) {
        await client.query('ROLLBACK');
        console.error(error);
        res.sendStatus(500);
    } finally {
        client.release();
    }
}



