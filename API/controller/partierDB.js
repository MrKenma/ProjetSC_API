const pool = require('../model/database');
const PartierModel = require('../model/partierDB');

module.exports.getPartier = async (req, res) => {
    const client = await pool.connect();
    const id = req.params.id;

    try {
        const {rows: partiers} = await PartierModel.getPartier(id, client);
        const partier = partiers[0];
        if (partier !== undefined) {
            res.json(partier);
        } else {
            res.sendStatus(404);
        }
    } catch (error) {
        console.error(error);
        res.sendStatus(500);
    } finally {
        client.release();
    }
}

module.exports.getPartiers = async (req, res) => {
    const client = await pool.connect();

    try {
        const {rows: partiers} = await PartierModel.getPartiers(client);
        if (partiers !== undefined) {
            res.json(partiers);
        } else {
            res.sendStatus(404);
        }
    } catch (error) {
        console.error(error);
        res.sendStatus(500);
    } finally {
        client.release();
    }
}


module.exports.postPartier = async (req, res) => {
    const client = await pool.connect();
    const {emailAddress,
        pseudo,
        password,
        firstName,
        lastName,
        picture,
        phoneNumber,
        refPhoneNumber,
        addressTown,
        addressZipCode} = req.body;

    try {
        await PartierModel.postPartier(emailAddress,
            pseudo,
            password,
            firstName,
            lastName,
            picture,
            phoneNumber,
            refPhoneNumber,
            addressTown,
            addressZipCode,
            client);
        res.sendStatus(201);
    } catch (error) {
        console.error(error);
        res.sendStatus(500);
    } finally {
        client.release();
    }
}

module.exports.updatePartier = async (req, res) => {
    const client = await pool.connect();
    const {id,
        emailAddress,
        pseudo,
        password,
        firstName,
        lastName,
        picture,
        phoneNumber,
        refPhoneNumber,
        addressTown,
        addressZipCode} = req.body;

    try {
        await PartierModel.updatePartier(  
            id,
            emailAddress,          
            pseudo,
            password,
            firstName,
            lastName,
            picture,
            phoneNumber,
            refPhoneNumber,
            addressTown,
            addressZipCode, client);
        res.sendStatus(204);
    } catch (error) {
        console.error(error);
        res.sendStatus(500);
    } finally {
        client.release();
    }
}

module.exports.deletePartier = async (req, res) => {
    const client = await pool.connect();
    const {emailAddress} = req.body;

    try {
        await PartierModel.deletePartier(emailAddress, client);
        res.sendStatus(204);
    } catch (error) {
        console.error(error);
        res.sendStatus(500);
    } finally {
        client.release();
    }
}
