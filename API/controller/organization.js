const pool = require('../model/database');
const OrganizationModel = require('../model/organization');
const ImageModel = require('../model/image');

/***************** CRUD for organization *****************/

module.exports.getAllOrganizations = async (req, res) => {
    const client = await pool.connect();

    try {

        const {rows: organizations} = await OrganizationModel.getAllOrganizations(client);
        
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

module.exports.getOrganization = async (req, res) => {
    const client = await pool.connect();
    const id = req.params.id;

    try {

        if (isNaN(id)) {
            res.sendStatus(400);
            return;
        }

        const {rows: organizations} = await OrganizationModel.getOrganization(id, client);
        const organization = organizations[0];

        if (organization !== undefined) {
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

module.exports.deleteOrganization = async (req, res) => {
    const client = await pool.connect();
    const id = req.params.id;

    try {

        if (isNaN(id)) {
            res.sendStatus(400);
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

