module.exports.findAll = async (client) => {
    return await client.query('SELECT * FROM shuttle');
}

module.exports.findOne = async (id, client) => {
    return await client.query('SELECT * FROM shuttle WHERE id = $1', [id]);
}

module.exports.create = async (departureTime, eventID, destinationTown, destinationZipCode, client) => {
    return await client.query('INSERT INTO shuttle (departureTime, eventID, destinationTown, destinationZipCode) VALUES ($1, $2, $3, $4)', [departureTime, eventID, destinationTown, destinationZipCode]);
}

module.exports.findByEvent = async (eventID, client) => {
    return await client.query('SELECT departureTime, userID, email, firstName, lastName, hasUploadedProfilePicture FROM shuttle s INNER JOIN shuttleMember sm ON s.id = sm.shuttleid INNER JOIN "user" u ON sm.partierID = u.id INNER JOIN partier p ON u.id = p.userID WHERE s.eventID = $1', [eventID]);
}

module.exports.delete = async (id, client) => {
    return await client.query('DELETE FROM shuttle WHERE id = $1', [id]);
}


