module.exports.findAll = async (client) => {
    return await client.query(`SELECT * FROM organization`);
}

module.exports.findOne = async (id, client) => {
    return await client.query(`SELECT * FROM organization WHERE userid = $1`, [id]);
}

module.exports.create = async (userID, responsibleName, isVerified, client) => {
    return await client.query(`INSERT INTO organization (userid, responsiblename, isverified) VALUES ($1, $2, $3)`, [userID, responsibleName, isVerified]);
}

module.exports.update = async (userID, responsibleName, isVerified, client) => {
    return await client.query(`UPDATE organization SET responsiblename = $2, isverified = $3 WHERE userid = $1`, [userID, responsibleName, isVerified]);
}

module.exports.delete = async (id, client) => {
    return await client.query(`DELETE FROM organization WHERE id = $1`, [id]);
}

