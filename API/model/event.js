// Get d'un seul event
module.exports.getEvent = async (id, client) => {
    return await client.query(`SELECT * FROM event WHERE id = $1`, [id]);
}

// Get de tous les events
module.exports.getEvents = async (client) => {
    return await client.query(`SELECT * FROM event`);
}

module.exports.postEvent = async (name, description, nameAndNumStreet, departingPoint, startDateAndTime, endDateAndTime, organizationId, addressTown, addressZipCode, client) => {
    return await client.query(`INSERT INTO event (name, description, nameAndNumStreet, departingPoint, startDateAndTime, endDateAndTime, organizationId, addressTown, addressZipCode)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING id`,
        [name, description, nameAndNumStreet, departingPoint, startDateAndTime, endDateAndTime, organizationId, addressTown, addressZipCode]);
}

// Attention aux modifications de date de début et de fin => entraine une modification des shuttles existants
module.exports.updateEvent = async (id, name, description, nameAndNumStreet, departingPoint, startDateAndTime, endDateAndTime, organizationId, addressTown, addressZipCode, client) => {
    return await client.query(`UPDATE event SET name = $1, description = $2, nameAndNumStreet = $3, departingPoint = $4, startDateAndTime = $5,
                 endDateAndTime = $6, organizationId = $7, addressTown = $8, addressZipCode = $9 WHERE id = $10`,
        [name, description, nameAndNumStreet, departingPoint, startDateAndTime, endDateAndTime, organizationId, addressTown, addressZipCode, id]);
}

// Pas oublier de gérer la suppression par rapport aux shuttle et shuttle_member
module.exports.deleteEvent = async (id, client) => {
    return await client.query(`DELETE FROM event WHERE id = $1`, [id]);
}

module.exports.getEventsByTown = async (addressTown, addressZipcode, client) => {
    return await client.query(`SELECT * FROM event WHERE addressTown = $1 AND addressZipCode = $2`, [addressTown, addressZipcode]);
}

module.exports.getEventsByOrganization = async (organizationId, client) => {
    return await client.query(`SELECT * FROM event WHERE organizationid = $1`, [organizationId]);
}