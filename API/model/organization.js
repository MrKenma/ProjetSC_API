module.exports.getAllOrganizations = async (client) => {
    return await client.query(`SELECT * FROM organization`);
}

module.exports.getOrganization = async (id, client) => {
    return await client.query(`SELECT * FROM organization WHERE userid = $1`, [id]);
}

module.exports.postOrganization = async (userID, responsibleName, isVerified, client) => {
    return await client.query(`INSERT INTO organization (userid, responsiblename, isverified) VALUES ($1, $2, $3)`, [userID, responsibleName, isVerified]);
}

module.exports.updateOrganization = async (userID, responsibleName, isVerified, client) => {
    return await client.query(`UPDATE organization SET responsiblename = $2, isverified = $3 WHERE userid = $1`, [userID, responsibleName, isVerified]);
}

module.exports.deleteOrganization = async (id, client) => {
    return await client.query(`DELETE FROM organization WHERE id = $1`, [id]);
}

/*
module.exports.getOrganizationByEmail = async (email, client) => {
    return await client.query(`SELECT * FROM organization WHERE email = $1`, [email]);
}

module.exports.getOrganizationByName = async (name, client) => {
    return await client.query(`SELECT * FROM organization WHERE name = $1`, [name]);
}

module.exports.emailExist = async (email, client) => {
    const { rows } = await client.query(`SELECT count(*) as nbr FROM organization WHERE email = $1`, [email]);
    return rows[0].nbr > 0;
}
*/