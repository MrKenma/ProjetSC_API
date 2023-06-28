module.exports.findAll = async (client) => {
    return await client.query(`SELECT * FROM partier`);
}

module.exports.findOne = async (id, client) => {
    return await client.query(`SELECT * FROM partier WHERE userid = $1`, [id]);
}

module.exports.create = async (userID, firstName, lastName, referencePhoneNumber, addressTown, addressZipCode, client) => {
    return await client.query(`INSERT INTO partier (userid, firstName, lastName, refPhoneNumber, addressTown, addressZipCode) VALUES ($1, $2, $3, $4, $5, $6)`, [userID, firstName, lastName, referencePhoneNumber, addressTown, addressZipCode]);
}

module.exports.update = async (userID, firstName, lastName, referencePhoneNumber, addressTown, addressZipCode, client) => {
    return await client.query(`UPDATE partier SET firstName = $2, lastName = $3, refPhoneNumber = $4, addressTown = $5, addressZipCode = $6 WHERE userid = $1`, [userID, firstName, lastName, referencePhoneNumber, addressTown, addressZipCode]);
}

module.exports.delete = async (userID, client) => {
    return await client.query(`DELETE FROM partier WHERE userid = $1`, [userID]);
}
