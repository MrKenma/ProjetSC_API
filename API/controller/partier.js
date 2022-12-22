const pool = require('../model/database');
const PartierModel = require('../model/partier');
const ImageModel = require('../model/image');

module.exports.getPartierByEmail = async (req, res) => {
    const client = await pool.connect();
    const email = req.params.email;

    try {
        const {rows: partiers} = await PartierModel.getPartierByEmail(email, client);

        const partier = partiers[0];

        if (partier === undefined) {
            res.json({id : -1})
            return;
        }

        console.log(partier);

        res.json(partier);
       
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

module.exports.registerPartier = async (req, res) => {
    const client = await pool.connect();
    const profilePicture = req.files.profilePicture ? req.files.profilePicture[0] : undefined;
    const {email,
           pseudo,
           password,
           firstName,
           lastName,
           phoneNumber,
           refPhoneNumber,
           addressTown,
           addressZipCode} = req.body;

    if (email === undefined 
        || pseudo === undefined 
        || password === undefined 
        || firstName === undefined 
        || lastName === undefined 
        || phoneNumber === undefined 
        || refPhoneNumber === undefined 
        || addressTown === undefined 
        || addressZipCode === undefined) {
        res.sendStatus(400);
        return;
    }

    let hasUploadedProfilePicture = false;

    if (profilePicture !== undefined) {
        hasUploadedProfilePicture = true;

        ImageModel.saveImage(profilePicture.buffer, email, './public/profile_picture', "jpeg").then(() => {
            console.log('Image saved');
        }).catch((error) => {
            console.log(error);
            res.sendStatus(500);
        });

    }

    try {
        await PartierModel.postPartier(email,
                                       pseudo,
                                       password,
                                       firstName,
                                       lastName,
                                       hasUploadedProfilePicture,
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

module.exports.updateAddress = async (req, res) => {
    const client = await pool.connect();
    const {email, addressTown, addressZipCode} = req.body;

    if (email === undefined || addressTown === undefined || addressZipCode === undefined) {
        res.sendStatus(400);
        return;
    }

    try {
        await PartierModel.updateAddress(email, addressTown, addressZipCode, client);
        res.sendStatus(204);
    } catch (error) {
        console.error(error);
        res.sendStatus(500);
    } finally {
        client.release();
    }
}

module.exports.updatePartier = async (req, res) => {
    const client = await pool.connect();
    const { emailAddress,
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

module.exports.emailExist = async (req, res) => {
    const client = await pool.connect();
    const {email} = req.body;

    try {
        const emailExist = await PartierModel.emailExist(email, client);
    
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

