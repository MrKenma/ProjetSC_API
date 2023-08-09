const pool = require('../model/database');
const OrganizationModel = require('../model/organization');
const ImageModel = require('../model/image');
const OrganizationORM = require('../ORM/model/organization');
const UserORM = require('../ORM/model/user');

/***************** CRUD for organization *****************/

/** 
 * @swagger
 *  components:
 *      schemas:
 *          Organization:
 *              type: object
 *              properties:
 *                  userID:
 *                      type: integer
 *                      description: l'id de l'utilisateur
 *                  responsibleName:
 *                      type: string
 *                      description: le nom du responsable de l'organisation
 *                  isVerified:
 *                      type: boolean
 *                      description: si l'organisation est vérifiée ou non
 *              example:
 *                  userID: 1
 *                  responsibleName: "Jean"
 *                  isVerified: true
 */


/**
 * @swagger
 * components:
 *  responses:
 *      AllOrganizationsFound:
 *          description: Récupère toutes les organisations
 */


module.exports.getAllOrganizations = async (req, res) => {
    const client = await pool.connect();

    try {

        const organizations = await OrganizationORM.findAll({
            include: UserORM
        });

        if (organizations === undefined) {
            res.sendStatus(404);
            return;
        }

        res.json(organizations);

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
 *      OrganizationFound:
 *          description: Récupère une organisation
 *      OrganizationNotFound:
 *          description: L'organisation n'a pas été trouvée
 *      OrganizationIdNotANumber:
 *          description: L'id de l'organisation n'est pas un nombre
 */

module.exports.getOrganization = async (req, res) => {
    const client = await pool.connect();
    const id = req.params.id;

    try {

        if (isNaN(id)) {
            res.sendStatus(400);
            return;
        }

        const organization = await OrganizationORM.findByPk(id, {
            include: UserORM
        });

        if (organization === undefined) {
            res.sendStatus(404);
            return;
        }
       
        res.json(organization);

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
 *      OrganizationCreated:
 *          description: L'organisation a été créée
 *      CreateOrganizationBadRequest:
 *          description: création impossible car l'un des paramètres n'est pas validee
 *  requestBodies:
 *      CreateOrganization:
 *          description: L'organisation à créer
 *          content:
 *              application/json:
 *                  schema:
 *                     $ref: '#/components/schemas/Organization'
 */

module.exports.postOrganization = async (req, res) => {
    const client = await pool.connect();
    const {userID, responsibleName, isVerified } = req.body;

    try {

        if (userID === undefined || responsibleName === undefined || isVerified === undefined) {
            res.sendStatus(400);
            return;
        }

        await OrganizationModel.postOrganization(userID, responsibleName, isVerified, client);
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
 *      OrganizationUpdated:
 *          description: L'organisation a été mise à jour
 *      OrganizationNotFound:
 *          description: L'organisation n'a pas été trouvée
 *      OrganizationIdNotANumber:
 *          description: L'id de l'organisation n'est pas un nombre
 *  requestBodies:
 *      OrganizationUpdated:
 *          description: L'organisation à mettre à jour
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/Organization'
 */

module.exports.updateOrganization = async (req, res) => {
    const client = await pool.connect();
    const { userID } = req.body;

    try {

        if (userID === undefined || isNaN(userID)) {
            res.sendStatus(400);
            return;
        }

        const { rows } = await OrganizationModel.getOrganization(userID, client);
        const organization = rows[0];

        if (organization === undefined) {
            res.sendStatus(404);
            return;
        }

        const { responsiblename : responsibleName, isverified : isVerified } = organization;

        const newResponsibleName = req.body.responsibleName === undefined ? responsibleName : req.body.responsibleName;
        const newIsVerified = req.body.isVerified === undefined ? isVerified : req.body.isVerified;

        await OrganizationModel.updateOrganization(userID, newResponsibleName, newIsVerified, client);

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
 *      OrganizationDeleted:
 *          description: L'organisation a été supprimée
 *      OrganizationNotFound:
 *          description: L'organisation n'a pas été trouvée
 *      OrganizationIdNotANumber:
 *          description: L'id de l'organisation n'est pas un nombre
 */

module.exports.deleteOrganization = async (req, res) => {
    const client = await pool.connect();
    const id = req.params.id;

    try {

        if (isNaN(id)) {
            res.sendStatus(400);
            return;
        }

        const { rows } = await OrganizationModel.getOrganization(id, client);

        if (rows[0] === undefined) {
            res.sendStatus(404);
            return;
        }

        await OrganizationModel.deleteOrganization(id, client);
        res.sendStatus(204);

    } catch (error) {
            
            console.error(error);
            res.sendStatus(500);
    
    } finally {
        client.release();
    }

}

