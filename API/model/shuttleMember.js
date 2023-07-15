module.exports.create = async (hasvalidated, hasarrivedsafely, shuttleid, partierid, client) => {
    return await client.query('INSERT INTO shuttleMember (hasvalidated, hasarrivedsafely, shuttleid, partierid) VALUES ($1, $2, $3, $4) RETURNING shuttleid, partierid', [hasvalidated, hasarrivedsafely, shuttleid, partierid]);
}

module.exports.findAll = async (client) => {
    return await client.query('SELECT * FROM shuttleMember');
}

module.exports.findOne = async (shuttleid, partierid, client) => {
    return await client.query('SELECT * FROM shuttleMember WHERE shuttleid = $1 AND partierid = $2', [shuttleid, partierid]);
}

module.exports.findOneByShuttleID = async (shuttleid, client) => {
    return await client.query('SELECT * FROM shuttleMember WHERE shuttleid = $1', [shuttleid]);
}

module.exports.update = async (hasvalidated, hasarrivedsafely, shuttleid, partierid, client) => {
    return await client.query('UPDATE shuttleMember SET hasvalidated = $1, hasarrivedsafely = $2 WHERE shuttleid = $3 AND partierid = $4 RETURNING shuttleid, partierid', [hasvalidated, hasarrivedsafely, shuttleid, partierid]);
}

module.exports.delete = async (shuttleid, partierid, client) => {
    return await client.query('DELETE FROM shuttleMember WHERE shuttleid = $1 AND partierid = $2', [shuttleid, partierid]);
}

module.exports.deleteAllByPartier = async (partierid, client) => {
    return await client.query('DELETE FROM shuttleMember WHERE partierid = $1', [partierid]);
}

