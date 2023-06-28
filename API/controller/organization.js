const pool = require('../model/database');
const OrganizationModel = require('../model/organization');
const ImageModel = require('../model/image');

/***************** CRUD for organization *****************/

module.exports.findAll = async (req, res) => {
    const client = await pool.connect();

    try {

        const {rows: organizations} = await OrganizationModel.findOne(client);
        
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

module.exports.findOne = async (req, res) => {
    const client = await pool.connect();
    const id = req.params.id;

    try {

        if (isNaN(id)) {
            res.sendStatus(400);
            return;
        }

        const {rows: organizations} = await OrganizationModel.findOne(id, client);
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

module.exports.create = async (req, res) => {
    const client = await pool.connect();
    const {userID, responsibleName, isVerified } = req.body;

    try {

        if (userID === undefined || responsibleName === undefined || isVerified === undefined) {
            res.sendStatus(400);
            return;
        }

        await OrganizationModel.create(userID, responsibleName, isVerified, client);
        res.sendStatus(201);

    } catch (error) {
        console.error(error);
        res.sendStatus(500);
    } finally {
        client.release();
    }
}

module.exports.update = async (req, res) => {
    const client = await pool.connect();
    const { userID } = req.body;

    try {

        if (userID === undefined || isNaN(userID)) {
            res.sendStatus(400);
            return;
        }

        const { rows } = await OrganizationModel.findOne(userID, client);
        const organization = rows[0];

        if (organization === undefined) {
            res.sendStatus(404);
            return;
        }

        const { responsiblename : responsibleName, isverified : isVerified } = organization;

        const newResponsibleName = req.body.responsibleName === undefined ? responsibleName : req.body.responsibleName;
        const newIsVerified = req.body.isVerified === undefined ? isVerified : req.body.isVerified;

        await OrganizationModel.update(userID, newResponsibleName, newIsVerified, client);

        res.sendStatus(200);

    } catch (error) {

        console.error(error);
        res.sendStatus(500);

    } finally {
        client.release();
    }
}

module.exports.delete = async (req, res) => {
    const client = await pool.connect();
    const id = req.params.id;

    try {

        if (isNaN(id)) {
            res.sendStatus(400);
            return;
        }

        await OrganizationModel.delete(id, client);
        res.sendStatus(204);

    } catch (error) {
            
            console.error(error);
            res.sendStatus(500);
    
    } finally {
        client.release();
    }

}

/********************************************************/

/* module.exports.getOrganizationByEmail = async (req, res) => {
    const client = await pool.connect();
    const email = req.params.email;

    try {
        const {rows: organizations} = await OrganizationModel.getOrganizationByEmail(email, client);

        const organization = organizations[0];

        if (organization === undefined) {
            res.json({id : -1})
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

module.exports.nameExists = async (req, res) => {
    const client = await pool.connect();
    const {id, name} = req.params;

    try {
        const {rows: organizations} = await OrganizationModel.getOrganizationByName(name, client);

        if (organizations[0] !== undefined) {
            res.json({exists: false});
        } else {
            res.json({exists: organizations[0].id !== id});
        }
    } catch (error) {
        console.error(error);
        res.sendStatus(500);
    } finally {
        client.release();
    }
}

module.exports.updateOrganization = async (req, res) => {
    const client = await pool.connect();
    const {id, email, password, name, responsibleName, referencePhoneNumber, administrativeProof} = req.body;

    try {
        await OrganizationModel.updateOrganization(id, email, password, name, responsibleName, referencePhoneNumber, administrativeProof, client);
        res.sendStatus(204);
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
        await OrganizationModel.deleteOrganization(id, client);
        res.sendStatus(204);
    } catch (error) {
        console.error(error);
        res.sendStatus(500);
    } finally {
        client.release();
    }
}

module.exports.emailExist = async (req, res) => {
    const client = await pool.connect();
    const {email} = req.body;

    try {
        const emailExist = await OrganizationModel.emailExist(email, client);
    
        if (emailExist === undefined) {
            res.sendStatus(404);
            return;
        }

        res.json(emailExist);

    } catch (error) {
        console.error(error);
        res.sendStatus(500);
    } finally {
        client.release();
    }
}

module.exports.registerOrganization = async (req, res) => {
    const client = await pool.connect();
    const administrativeProof = req.files.administrativeProof[0];
    const {email, password, name, responsibleName, referencePhoneNumber} = req.body;

    if (email === undefined 
        || password === undefined 
        || name === undefined 
        || responsibleName === undefined 
        || referencePhoneNumber === undefined
        || administrativeProof === undefined) {
        res.sendStatus(400);
        return;
    }

    ImageModel.saveImage(administrativeProof.buffer, email, './public/proof', "pdf").then(() => {
    }).catch((error) => {
        console.log(error);
        res.sendStatus(500);
    });
    

    try {
        await OrganizationModel.postOrganization(email, password, name, responsibleName, referencePhoneNumber, false, client);
        res.sendStatus(201);
    } catch (error) {
        console.error(error);
        res.sendStatus(500);
    } finally {
        client.release();
    }

} */
