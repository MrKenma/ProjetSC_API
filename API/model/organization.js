// Get pour une seule organisation

module.exports.getOrganization = async (id, client) => {
    return await client.query("SELECT * FROM organization WHERE id = $1", [id]);
}

// Get de toutes les organisations
module.exports.getOrganizations = async (client) => {
    return await client.query(`SELECT * FROM organization`);
}

module.exports.getOrganizationByEmail = async (email, client) => {
    return await client.query(`SELECT * FROM organization WHERE email = $1`, [email]);
}

module.exports.getOrganizationByName = async (name, client) => {
    return await client.query(`SELECT * FROM organization WHERE name = $1`, [name]);
}

module.exports.postOrganization = async (emailAddress, password, name, responsibleName, referencePhoneNumber, isVerified, client) => {
    return await client.query(`INSERT INTO organization (emailaddress, password, name, responsiblename, referencephonenumber, isVerified) 
        VALUES ($1, $2, $3, $4, $5, $6) RETURNING id`, [emailAddress, password, name, responsibleName, referencePhoneNumber, isVerified]);
}


module.exports.updateOrganization = async (id, emailAddress, password, name, responsibleName, referencePhoneNumber, administrativeProof, client) => {
    return await client.query(`UPDATE organization SET emailaddress = $2, password = $3, name = $4, responsiblename = $5, referencephonenumber = $6, administrativeproof = $7 
        WHERE id = $1`, [id, emailAddress, password, name, responsibleName, referencePhoneNumber, administrativeProof]);
}

// Pas oublier de gérer la suppression par rapport au event, shuttle, ...
module.exports.deleteOrganization = async (id, client) => {
    return await client.query(`DELETE FROM organization WHERE id = $1`, [id]);
}

module.exports.emailExist = async (email, client) => {
    const { rows } = await client.query(`SELECT count(*) as nbr FROM organization WHERE email = $1`, [email]);
    return rows[0].nbr > 0;
}
