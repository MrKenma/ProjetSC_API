require("dotenv").config();
const process = require("process");
const jwt = require("jsonwebtoken");

const pool = require('../model/database');
const UserModel = require('../model/user');

const PartierModel = require('../model/partier');
const OrganizationModel = require('../model/organization');
const ImageModel = require('../model/image');

const { compareHash } = require('../utils/utils');
const { decode } = require("punycode");

/***************** CRUD for user *****************/

module.exports.postUser = async (req, res) => {
    const client = await pool.connect();
    const {email, password, pseudo, phoneNumber, hasUploadedProfilePicture, isAdmin } = req.body;

    try {

        if (email === undefined || password === undefined || pseudo === undefined || phoneNumber === undefined || hasUploadedProfilePicture === undefined || isAdmin === undefined) {
            res.sendStatus(400);
            return;
        }

        await UserModel.postTown(email, password, pseudo, phoneNumber, hasUploadedProfilePicture, isAdmin, client);

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
            console.log('id is not a number');
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
    const { id } = req.body;
    
    try {
        const {rows: users} = await UserModel.getUser(id, client);

        const user = users[0];

        if (user === undefined) {
            res.sendStatus(404);
            return;
        }

        const { email, password, pseudo, phonenumber: phoneNumber, hasuploadedprofilepicture : hasUploadedProfilePicture, isadmin : isAdmin } = user;

        const newEmail = req.body.email === undefined ? email : req.body.email;
        const newPassword = req.body.password === undefined ? password : req.body.password;
        const newPseudo = req.body.pseudo === undefined ? pseudo : req.body.pseudo;
        const newPhoneNumber = req.body.phoneNumber === undefined ? phoneNumber : req.body.phoneNumber;
        const newHasUploadedProfilePicture = req.body.hasUploadedProfilePicture === undefined ? hasUploadedProfilePicture : req.body.hasUploadedProfilePicture;
        const newIsAdmin = req.body.isAdmin === undefined ? isAdmin : req.body.isAdmin;

        await UserModel.updateUser(id, newEmail, newPassword, newPseudo, newPhoneNumber, newHasUploadedProfilePicture, newIsAdmin, client);

        res.sendStatus(200);

    } catch (error) {

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

    console.log(req.body);

    try {

        await client.query('BEGIN')

        if (pseudo === undefined || email === undefined || password === undefined || phoneNumber === undefined ) {
            res.sendStatus(400);
            return;
        }

        const emailExists = await UserModel.emailExists(email, client);
        const pseudoExists = await UserModel.pseudoExists(pseudo, client);

        if (emailExists || pseudoExists) {
            res.sendStatus(409);
            return;
        }

        const hasUploadedProfilePicture = req.files.profilePicture !== undefined;

        if (hasUploadedProfilePicture) 
            await ImageModel.saveImage(req.files.profilePicture[0].buffer, email, './public/profile_picture', "jpeg");
            
        const result  = await UserModel.postTown(email, password, pseudo, phoneNumber, hasUploadedProfilePicture, false, client);

        const userID = result.rows[0].id;

        if (req.body.partier !== undefined) {

            const { firstName, lastName, refPhoneNumber, addressTown, addressZipCode } = JSON.parse(req.body.partier);

            await PartierModel.postTown(userID, firstName, lastName, refPhoneNumber, addressTown, addressZipCode, client);

        } else if (req.body.organization !== undefined) {

            const { responsibleName } = JSON.parse(req.body.organization);

            await OrganizationModel.postTown(userID, responsibleName, false, client);

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
            res.sendStatus(404);
            return;
        }

        if (! await compareHash(password, user.password)) {
            res.sendStatus(401);
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




