const pool = require('../model/database');
const PartierModel = require('../model/partier');


/***************** CRUD for partier *****************/

module.exports.getAllPartiers = async (req, res) => {
    const client = await pool.connect();
    
    try {
        const {rows: partiers} = await PartierModel.getAllPartiers(client);

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

module.exports.getPartier = async (req, res) => {
    const client = await pool.connect();
    const id = req.params.id;

    try {

        if (isNaN(id)) {
            res.sendStatus(400);
            return;
        }

        const {rows : partiers} = await PartierModel.getPartier(id, client);

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

module.exports.updatePartier = async (req, res) => {
    const client = await pool.connect();
    const { userid } = req.body;

    console.log(req.body);

    try {

        if (userid === undefined || isNaN(userid)) {
            res.sendStatus(400);
            return;
        }

        const {rows: partiers} = await PartierModel.getPartier(userid, client);

        const partier = partiers[0];

        if (partier === undefined) {
            res.sendStatus(404);
            return;
        }

        const { firstname : firstName, lastname : lastName, refphonenumber: referencePhoneNumber, addresstown: addressTown, addresszipcode: addressZipCode } = partier;

        const newFirstName = req.body.firstname === undefined ? firstName : req.body.firstname;
        const newLastName = req.body.lastname === undefined ? lastName : req.body.lastname;
        const newReferencePhoneNumber = req.body.refphoneNumber === undefined ? referencePhoneNumber : req.body.referencePhoneNumber;
        const newAddressTown = req.body.addresstown === undefined ? addressTown : req.body.addresstown;
        const newAddressZipCode = req.body.addresszipcode === undefined ? addressZipCode : req.body.addresszipcode;


        await PartierModel.updatePartier(userid, newFirstName, newLastName, newReferencePhoneNumber, newAddressTown, newAddressZipCode, client);

        res.sendStatus(200);

    } catch (error) {
        console.error(error);
        res.sendStatus(500);
    } finally {
        client.release();
    }
}

module.exports.deletePartier = async (req, res) => {

    const client = await pool.connect();
    const userID = req.params.id;

    try {
        
        if (isNaN(userID)) {
            res.sendStatus(400);
            return;
        }

        await PartierModel.deletePartier(userID, client);
       
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



