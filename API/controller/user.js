require("dotenv").config();
const process = require("process");
const jwt = require("jsonwebtoken");

const pool = require('../model/database');
const UserModel = require('../model/user');

const PartierModel = require('../model/partier');
const OrganizationModel = require('../model/organization');
const ImageModel = require('../model/image');

const { compareHash } = require('../utils/utils');

/***************** CRUD for user *****************/

module.exports.create = async (req, res) => {
    const client = await pool.connect();
    const {email, password, pseudo, phoneNumber, hasUploadedProfilePicture, isAdmin } = req.body;

    try {

        if (email === undefined || password === undefined || pseudo === undefined || phoneNumber === undefined || hasUploadedProfilePicture === undefined || isAdmin === undefined) {
            res.sendStatus(400);
            return;
        }

        await UserModel.create(email, password, pseudo, phoneNumber, hasUploadedProfilePicture, isAdmin, client);

        res.sendStatus(201);

    } catch (error) {

        console.error(error);
        res.sendStatus(500);

    } finally {

        client.release();    
    }

}

module.exports.findAll = async (req, res) => {
    const client = await pool.connect();

    try {

        const {rows: users} = await UserModel.findAll(client);

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

module.exports.findOne = async (req, res) => {
    const client = await pool.connect();
    const id = req.params.id;

    try {

        if (isNaN(id)) {
            console.log('id is not a number');
            res.sendStatus(400);
            return;
        }
            
        const {rows: users} = await UserModel.findOne(id, client);

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

module.exports.update = async (req, res) => {
    const client = await pool.connect();
    const { id } = req.body;
    
    try {
        const {rows: users} = await UserModel.findOne(id, client);

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

        await UserModel.update(id, newEmail, newPassword, newPseudo, newPhoneNumber, newHasUploadedProfilePicture, newIsAdmin, client);

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

        await UserModel.delete(id, client);

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
    const email = req.params.email;

    try {

        const { rows } = await UserModel.emailExists(email, client);

        count = parseInt(rows[0].count);

        res.json(count !== 0);

    } catch (error) {

        console.error(error);
        res.sendStatus(500);

    } finally {
        client.release();
    }
}

module.exports.pseudoExists = async (req, res) => {
    const client = await pool.connect();
    const pseudo = req.params.pseudo;

    try {

        const { rows } = await UserModel.pseudoExists(pseudo, client);

        count = parseInt(rows[0].count);

        res.json(count !== 0);

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

        await client.query('BEGIN')

        if (pseudo === undefined || email === undefined || password === undefined || phoneNumber === undefined ) {
            res.sendStatus(400);
            return;
        }

        const hasUploadedProfilePicture = req.files.profilePicture !== undefined;
        
        if (hasUploadedProfilePicture) 
            await ImageModel.saveImage(req.files.profilePicture[0].buffer, email, './public/profile_picture', "jpeg");
            
        const result  = await UserModel.create(email, password, pseudo, phoneNumber, hasUploadedProfilePicture, false, client);

        const userID = result.rows[0].id;

        if (req.body.partier !== undefined) {

            const { firstName, lastName, refPhoneNumber, addressTown, addressZipCode } = JSON.parse(req.body.partier);

            await PartierModel.create(userID, firstName, lastName, refPhoneNumber, addressTown, addressZipCode, client);

        } else if (req.body.organization !== undefined) {

            const { responsibleName } = JSON.parse(req.body.organization);

            await OrganizationModel.create(userID, responsibleName, false, client);

            await ImageModel.savePDF(req.files.proof[0].buffer, email, './public/proof');

        } else {
            await client.query('ROLLBACK');
            console.log('partier or organization is undefined');
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
    const { email, password } = req.query;

    try {

        if (email === undefined || password === undefined) {
            console.log('email or password is undefined');
            res.sendStatus(400);
            return;
        }

        const {rows: users} = await UserModel.findOneByEmail(email, client);

        const user = users[0];

        if (user === undefined) {
            console.log('user is undefined');
            res.sendStatus(404);
            return;
        }
        
        if (!compareHash(password, user.password)) {
            res.sendStatus(401);
            return;
        }

        const payload = {status : user.isadmin, value : {email: user.email}};
        const token = jwt.sign(payload, process.env.SECRET_TOKEN, {expiresIn: '1d'});

        const {rows: partiers} = await PartierModel.findOne(user.id, client);

        const partier = partiers[0];

        if (partier !== undefined) {
            user.partier = partier;
            res.json({user : user, token: token});
            return;
        }

        const {rows: organizations} = await OrganizationModel.findOne(user.id, client);

        const organization = organizations[0];

        if (organization !== undefined) {
            user.organization = organization;
            res.json({user : user, token: token});
            return;
        }

        res.sendStatus(404);
    
    } catch (error) {
            
        console.error(error);
        res.sendStatus(500);
    
    } finally {

        client.release();

    }


}




