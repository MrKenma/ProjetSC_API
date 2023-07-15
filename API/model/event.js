module.exports.findAll = async (client) => {
    return await client.query(`SELECT * FROM event`);
}

module.exports.findOne = async (id, client) => {
    return await client.query(`SELECT * FROM event WHERE id = $1`, [id]);
}

module.exports.delete = async (id, client) => {
    return await client.query(`DELETE FROM event WHERE id = $1`, [id]);
}

module.exports.create = async (name, description, nameandnumstreet, departingpoint, startdatetime, enddatetime, organizationid, addresstown, addresszipcode, client) => {
    return await client.query(`INSERT INTO event (name, description, nameandnumstreet, departingpoint, startdatetime, enddatetime, organizationid, addresstown, addresszipcode) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING id`, [name, description, nameandnumstreet, departingpoint, startdatetime, enddatetime, organizationid, addresstown, addresszipcode]);
}

module.exports.update = async (id, name, description, nameandnumstreet, departingpoint, startdatetime, enddatetime, addresstown, addresszipcode, organizationid, client) => {
    return await client.query(`UPDATE event SET name = $1, description = $2, nameandnumstreet = $3, departingpoint = $4, startdatetime = $5, enddatetime = $6, addresstown = $7, addresszipcode = $8, organizationid = $9 WHERE id = $10`, [name, description, nameandnumstreet, departingpoint, startdatetime, enddatetime, addresstown, addresszipcode, organizationid, id]);
}

module.exports.nameExists = async (name, client) => {
    return await client.query(`SELECT COUNT(*) FROM event WHERE name = $1`, [name]);
}

// Pas oublier de gérer la suppression par rapport aux shuttle et shuttle_member
module.exports.deleteEvent = async (id, client) => {
    return await client.query(`DELETE FROM event WHERE id = $1`, [id]);
}

module.exports.getEventsByTown = async (addressTown, addressZipcode, client) => {
    return await client.query(`SELECT * FROM event WHERE addressTown = $1 AND addressZipCode = $2`, [addressTown, addressZipcode]);
}

module.exports.findManyByOrganization = async (organizationId, client) => {
    return await client.query(`SELECT * FROM event WHERE organizationid = $1`, [organizationId]);
}