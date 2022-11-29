// Get d'un seul partier
module.exports.getPartier = async (emailAddress, client) => {
    return await client.query(`SELECT * FROM partier WHERE emailAddress = $1`, [emailAddress]);
}

// Get de tous les partiers
module.exports.getPartiers = async (client) => {
    return await client.query(`SELECT * FROM partier`);
}

module.exports.postPartier = async (emailAddress, pseudo, password, firstName, lastName, picture, phoneNumber, refPhoneNumber, addressTown, addressZipCode, client) => {
    return await client.query(`INSERT INTO partier (emailAddress, pseudo, password, firstName, lastName, picture, phoneNumber, refPhoneNumber, addressTown, addressZipCode)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`, [emailAddress, pseudo, password, firstName, lastName, picture, phoneNumber, refPhoneNumber, addressTown, addressZipCode]);
}

// Gérer le changement de shuttle si la personne change son adresse
module.exports.updatePartier = async (emailAddress, pseudo, password, firstName, lastName, picture, phoneNumber, refPhoneNumber, addressTown, addressZipCode, client) => {
    return await client.query(`UPDATE partier SET pseudo = $1, password = $2, firstName = $3, lastName = $4, picture = $5, phoneNumber = $6,
                   refPhoneNumber = $7, addressName = $8, addressZipCode = $9 WHERE emailAddress = $10`,
        [emailAddress, pseudo, password, firstName, lastName, picture, phoneNumber, refPhoneNumber, addressTown, addressZipCode]);
}

// Gérer la suppression de shuttle_member et la vérification des shuttles si suppression
module.exports.deletePartier = async (emailAddress, client) => {
    return await client.query(`DELETE FROM partier WHERE emailAddress = $1`, [emailAddress]);
}