require("dotenv").config();
const process = require("process");
const jwt = require("jsonwebtoken");

const pool = require('../model/database');
const UserModel = require('../model/user');

const PartierModel = require('../model/partier');
const OrganizationModel = require('../model/organization');
const ImageModel = require('../model/image');

const { compareHash, getHash} = require('../utils/utils');
const { decode } = require("punycode");
const { parse } = require("path");

/***************** CRUD for user *****************/

module.exports.postUser = async (req, res) => {
    const client = await pool.connect();
    const {email, password, pseudo, phoneNumber, hasUploadedProfilePicture, isAdmin } = req.body;

    try {

        if (email === undefined || password === undefined || pseudo === undefined || phoneNumber === undefined || hasUploadedProfilePicture === undefined || isAdmin === undefined) {
            res.sendStatus(400);
            return;
        }

        //await UserModel.postTown(email, password, pseudo, phoneNumber, hasUploadedProfilePicture, isAdmin, client);

        res.sendStatus(201);

    } catch (error) {

        console.error(error);
        res.sendStatus(500);

    } finally {

        client.release();    
    }

}

module.exports.getAllUsers = async (req, res) => {
    const client = await pool.connect();

    try {

        const {rows: users} = await UserModel.getAllUsers(client);

        if (users === undefined) {
            res.sendStatus(404);
            return;
        }

        res.json(users);

    } catch (error) {

        console.error(error);
        res.sendStatus(500);

    } finally {

        client.release();

    }
}

module.exports.getUser = async (req, res) => {
    const client = await pool.connect();
    const id = req.params.id;

    try {

        if (isNaN(id)) {
            res.sendStatus(400);
            return;
        }
            
        const {rows: users} = await UserModel.getUser(id, client);

        const user = users[0];

        if (user === undefined) {
            res.sendStatus(404);
            return;
        }

        res.json(user);
        
    } catch (error) {

        console.error(error);
        res.sendStatus(500);

    } finally {
        client.release();
    }
}

module.exports.updateUser = async (req, res) => {
    const client = await pool.connect();
    const id = parseInt(req.body.id);
    
    try {

        await client.query('BEGIN');

        if (isNaN(id)) {
            res.sendStatus(400);
            return;
        }

        const {rows: users} = await UserModel.getUser(id, client);
        const user = users[0];

        if (user === undefined) {
            res.sendStatus(404);
            return;
        }

        const { email, password, pseudo, phoneNumber } = req.body;

        if (await UserModel.emailExists(email, client) && email !== user.email) {
            res.sendStatus(409).send('Email already used');
            return;
        }

        if (await UserModel.pseudoExists(pseudo, client) && pseudo !== user.pseudo) {
            res.sendStatus(409).send('Pseudo already used');
            return;
        }

        // Photo de profil
        const hasUploadedProfilePicture = req.files.profilePicture !== undefined;

        if (hasUploadedProfilePicture)
            await ImageModel.saveImage(req.files.profilePicture[0].buffer, email, './public/profile_picture');

        // Update user
        const encryptedPassword = password ? await getHash(password) : password;

        const updateUser = [
            email || user.email,
            encryptedPassword || user.password,
            pseudo || user.pseudo,
            phoneNumber || user.phonenumber,
            hasUploadedProfilePicture || user.hasuploadedprofilepicture,
            user.isadmin
        ];

        await UserModel.updateUser(id, ...updateUser, client);

        if (req.body.partier !== undefined) {
            const { firstName, lastName, refPhoneNumber, addressTown, addressZipCode } = JSON.parse(req.body.partier);

            const { rows: partiers } = await PartierModel.getPartier(id, client);
            const partier = partiers[0];

            if (partier === undefined) {
                await client.query('ROLLBACK');
                res.sendStatus(404);
                return;
            }

            const updatePartier = [
                firstName || partier.firstname,
                lastName || partier.lastname,
                refPhoneNumber || partier.refphonenumber,
                addressTown || partier.addresstown,
                addressZipCode || partier.addresszipcode
            ];

            await PartierModel.updatePartier(id, ...updatePartier, client);
        } else if (req.body.organization !== undefined) {
            let { responsibleName, isVerified } = JSON.parse(req.body.organization);

            const { rows: organizations } = await OrganizationModel.getOrganization(id, client);
            const organization = organizations[0];

            if (organization === undefined) {
                await client.query('ROLLBACK');
                res.sendStatus(404);
                return;
            }

            if (req.files.proof !== undefined) {
                await ImageModel.savePDF(req.files.proof[0].buffer, email, './public/proof');
            }

            responsibleName = responsibleName || organization.responsiblename;

            await OrganizationModel.updateOrganization(id, responsibleName, isVerified, client);
        }

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

module.exports.deleteUser = async (req, res) => {

    const client = await pool.connect();

    const id = req.params.id;

    try {

        if (isNaN(id)) {
            res.sendStatus(400);
            return;
        }

        const {rows: users} = await UserModel.getUser(id, client);

        const user = users[0];

        if (user === undefined) {
            res.sendStatus(404);
            return;
        }

        await UserModel.deleteUser(id, client);

        res.sendStatus(204);

    } catch (error) {
        console.error(error);
        res.sendStatus(500);
    } finally {
        client.release();
    }
}

/*************************************************/

module.exports.emailExists = async (req, res) => {
    const client = await pool.connect();
    const email = decodeURIComponent(req.params.email);

    try {

        if (email === undefined) {
            res.sendStatus(400);
            return;
        }

        res.json(await UserModel.emailExists(email, client));

    } catch (error) {

        console.error(error);
        res.sendStatus(500);

    } finally {
        client.release();
    }
}

module.exports.pseudoExists = async (req, res) => {
    const client = await pool.connect();
    const pseudo = decodeURIComponent(req.params.pseudo);

    try {

        if (pseudo === undefined) {
            res.sendStatus(400);
            return;
        }

        res.json(await UserModel.pseudoExists(pseudo, client));

    } catch (error) {

        console.error(error);
        res.sendStatus(500);

    } finally {
        client.release();
    }
}

module.exports.register = async (req, res) => {
    const client = await pool.connect();

    const { pseudo, email, password, phoneNumber } = req.body;

    try {

        await client.query('BEGIN');

        if (pseudo === undefined || email === undefined || password === undefined || phoneNumber === undefined ) {
            res.sendStatus(400);
            return;
        }

        const emailExists = await UserModel.emailExists(email, client);
        const pseudoExists = await UserModel.pseudoExists(pseudo, client);

        if (emailExists) {
            res.status(409).send('Email already exists');
            return;
        }

        if (pseudoExists) {
            res.status(409).send('Pseudo already exists');
            return;
        }

        const hasUploadedProfilePicture = req.files.profilePicture !== undefined;

        if (hasUploadedProfilePicture) 
            await ImageModel.saveImage(req.files.profilePicture[0].buffer, email, './public/profile_picture');

        const encryptedPassword = await getHash(password);
        const result  = await UserModel.postUser(email, encryptedPassword, pseudo, phoneNumber, hasUploadedProfilePicture, false, client);

        const userID = result.rows[0].id;

        if (req.body.partier !== undefined) {

            const { firstName, lastName, refPhoneNumber, addressTown, addressZipCode } = JSON.parse(req.body.partier);

            if (firstName === undefined || lastName === undefined || refPhoneNumber === undefined || addressTown === undefined || addressZipCode === undefined) {
                await client.query('ROLLBACK');
                res.sendStatus(400);
                return;
            }
            
            await PartierModel.postPartier(userID, firstName, lastName, refPhoneNumber, addressTown, addressZipCode, client);

        } else if (req.body.organization !== undefined) {

            const { responsibleName } = JSON.parse(req.body.organization);
            
            if (responsibleName === undefined) {
                await client.query('ROLLBACK');
                res.sendStatus(400);
                return;
            }

            await OrganizationModel.postOrganization(userID, responsibleName, false, client);

            const hasUploadedProof = req.files.proof !== undefined;
            if (hasUploadedProof)
                await ImageModel.savePDF(req.files.proof[0].buffer, email, './public/proof');

        } else {
            await client.query('ROLLBACK');
            res.sendStatus(400);
            return;
        }      

        await client.query('COMMIT');
        res.sendStatus(201);

    } catch (error) {

        await client.query('ROLLBACK');
        console.error(error);
        res.sendStatus(500);

    } finally {

        client.release();

    }
}

module.exports.login = async (req, res) => {

    const client = await pool.connect();
    const email = decodeURIComponent(req.query.email);
    const password = decodeURIComponent(req.query.password);
    let userRole;

    try {

        if (email === undefined || password === undefined) {
            res.sendStatus(400);
            return;
        }

        const {rows: users} = await UserModel.getUserByEmail(email, client);

        const user = users[0];

        if (user === undefined) {
            res.status(404).send('Email not found');
            return;
        }

        if (!await compareHash(password, user.password)) {
            res.status(401).send('Wrong password');
            return;
        }

        const {rows: partiers} = await PartierModel.getPartier(user.id, client);

        const partier = partiers[0];

        if (partier !== undefined) {
            user.partier = partier;
            userRole = 'partier';
        }

        const {rows: organizations} = await OrganizationModel.getOrganization(user.id, client);

        const organization = organizations[0];

        if (organization !== undefined) {
            user.organization = organization;
            userRole = 'organization';
        }

        if(user.isadmin) {
            userRole = 'admin';
        }

        if (!user.isadmin && partier === undefined && organization === undefined) { 
            res.sendStatus(400);
            return;
        }

        const payload = {status : userRole, value : {id: user.id, email: user.email, pseudo: user.pseudo}};
        const token = jwt.sign(payload, process.env.SECRET_TOKEN, {expiresIn: '1d'});
        res.json({user, token});
    
    } catch (error) {
            
        console.error(error);
        res.sendStatus(500);
    
    } finally {

        client.release();

    }

}




