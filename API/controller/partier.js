const pool = require('../model/database');
const PartierModel = require('../model/partier');


/***************** CRUD for partier *****************/

module.exports.findAll = async (req, res) => {
    const client = await pool.connect();
    
    try {
        const {rows: partiers} = await PartierModel.findAll(client);

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

module.exports.findOne = async (req, res) => {
    const client = await pool.connect();
    const id = req.params.id;

    try {

        if (isNaN(id)) {
            res.sendStatus(400);
            return;
        }

        const {rows : partiers} = await PartierModel.findOne(id, client);

        const partier = partiers[0];

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

module.exports.create = async (req, res) => {
    const client = await pool.connect();
    const { userID, firstName, lastName, referencePhoneNumber, addressTown, addressZipCode } = req.body;

    try {

        if (userID === undefined || firstName === undefined || lastName === undefined || referencePhoneNumber === undefined || addressTown === undefined || addressZipCode === undefined) {
            res.sendStatus(400);
            return;
        }

        await PartierModel.create(userID, firstName, lastName, referencePhoneNumber, addressTown, addressZipCode, client);

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
    const { id } = req.body;

    try {

        if (id === undefined || isNaN(id)) {
            res.sendStatus(400);
            return;
        }

        const {rows: partiers} = await PartierModel.findOne(id, client);

        const partier = partiers[0];

        if (partier === undefined) {
            res.sendStatus(404);
            return;
        }

        const { firstname : firstName, lastname : lastName, refphonenumber: referencePhoneNumber, addresstown: addressTown, addresszipcode: addressZipCode } = partier;

        const newFirstName = req.body.firstName === undefined ? firstName : req.body.firstName;
        const newLastName = req.body.lastName === undefined ? lastName : req.body.lastName;
        const newReferencePhoneNumber = req.body.referencePhoneNumber === undefined ? referencePhoneNumber : req.body.referencePhoneNumber;
        const newAddressTown = req.body.addressTown === undefined ? addressTown : req.body.addressTown;
        const newAddressZipCode = req.body.addressZipCode === undefined ? addressZipCode : req.body.addressZipCode;


        await PartierModel.update(id, newFirstName, newLastName, newReferencePhoneNumber, newAddressTown, newAddressZipCode, client);

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
    const userID = req.params.id;

    try {
        
        if (isNaN(userID)) {
            res.sendStatus(400);
            return;
        }

        await PartierModel.delete(userID, client);
       
    } catch (error) {
        console.error(error);
        res.sendStatus(500);
    } finally {
        client.release();
    }
}

/***************** CRUD for partier *****************/


/* module.exports.registerPartier = async (req, res) => {
    const client = await pool.connect();
    const profilePicture = req.files.profilePicture ? req.files.profilePicture[0] : undefined;
    const {email,
           pseudo,
           password,
           firstName,
           lastName,
           phoneNumber,
           refPhoneNumber,
           isAdmin,
           addressTown,
           addressZipCode} = req.body;

    if (email === undefined 
        || pseudo === undefined 
        || password === undefined 
        || firstName === undefined 
        || lastName === undefined 
        || phoneNumber === undefined 
        || refPhoneNumber === undefined 
        || isAdmin ===undefined
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
                                       isAdmin,
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
} */



