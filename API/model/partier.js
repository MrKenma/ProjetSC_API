const sharp = require("sharp");

// Get d'un seul partier
module.exports.getPartierByEmail = async (email, client) => {
    return await client.query(`SELECT * FROM partier WHERE email = $1`, [email]);
}

// Get de tous les partiers
module.exports.getPartiers = async (client) => {
    return await client.query(`SELECT * FROM partier`);
}

module.exports.postPartier = async (email, pseudo, password, firstName, lastName, hasUploadedProfilePicture, phoneNumber, refPhoneNumber, addressTown, addressZipCode, client) => {
    return await client.query(`INSERT INTO partier (email, pseudo, password, firstName, lastName, hasuploadedprofilepicture, phoneNumber, refPhoneNumber, addressTown, addressZipCode)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING id`,
        [email, pseudo, password, firstName, lastName, hasUploadedProfilePicture, phoneNumber, refPhoneNumber, addressTown, addressZipCode]);
}

module.exports.updateAddress = async (email, addressTown, addressZipCode, client) => {
    return await client.query(`UPDATE partier SET addressTown = $2, addressZipCode = $3 WHERE email = $1`, [email, addressTown, addressZipCode]);
}

// Gérer le changement de shuttle si la personne change son adresse
module.exports.updatePartier = async (id, emailAddress, pseudo, password, firstName, lastName, picture, phoneNumber, refPhoneNumber, addressTown, addressZipCode, client) => {
    return await client.query(`UPDATE partier SET emailAddress = $2, pseudo = $3, password = $4, firstName = $5, lastName = $6, picture = $7, 
                   phoneNumber = $8, refPhoneNumber = $9, addressName = $10, addressZipCode = $11 WHERE id = $1`,
        [id, emailAddress, pseudo, password, firstName, lastName, picture, phoneNumber, refPhoneNumber, addressTown, addressZipCode]);
}

// Gérer la suppression de shuttle_member et la vérification des shuttles si suppression
module.exports.deletePartier = async (id, client) => {
    return await client.query(`DELETE FROM partier WHERE id = $1`, [id]);
}

module.exports.emailExist = async (email, client) => {
    const { rows } = await client.query(`SELECT count(*) as nbr FROM partier WHERE email = $1`, [email]);
    return rows[0].nbr > 0;
}