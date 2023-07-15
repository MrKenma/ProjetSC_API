module.exports.findAll = async (client) => {
    return await client.query('SELECT * FROM shuttle');
}

module.exports.findOne = async (id, client) => {
    return await client.query('SELECT * FROM shuttle WHERE id = $1', [id]);
}

module.exports.create = async (departureTime, eventID, destinationTown, destinationZipCode, client) => {
    return await client.query('INSERT INTO shuttle (departureTime, eventID, destinationTown, destinationZipCode) VALUES ($1, $2, $3, $4) RETURNING id', [departureTime, eventID, destinationTown, destinationZipCode]);
}

module.exports.findOneByDetails = async (departureTime, eventID, destinationTown, destinationZipCode, client) => {
    return await client.query('SELECT * FROM shuttle WHERE departureTime = $1 AND eventID = $2 AND destinationTown = $3 AND destinationZipCode = $4', [departureTime, eventID, destinationTown, destinationZipCode]);
}

module.exports.delete = async (id, client) => {
    return await client.query('DELETE FROM shuttle WHERE id = $1', [id]);
}

module.exports.deleteEmptyShuttle = async (id, client) => {
    return await client.query('DELETE FROM shuttle WHERE id = $1 AND (SELECT COUNT(*) FROM shuttleMember WHERE shuttleid = $1) = 0', [id]);
}


