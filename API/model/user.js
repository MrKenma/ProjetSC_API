module.exports.postUser = async (email, password, pseudo, phoneNumber, hasUploadedProfilePicture, isAdmin, client) => {
    return await client.query(`INSERT INTO "user" (email, password, pseudo, phoneNumber, hasUploadedProfilePicture, isAdmin) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id`, [email, password, pseudo, phoneNumber, hasUploadedProfilePicture, isAdmin]);
}

module.exports.getAllUsers = async (client) => {
    return await client.query(`SELECT * FROM "user"`);
}

module.exports.getUser = async (id, client) => {
    return await client.query(`SELECT * FROM "user" WHERE id = $1`, [id]);
}

module.exports.getUserByEmail = async (email, client) => {
    return await client.query(`SELECT * FROM "user" WHERE email = $1`, [email]);
}

module.exports.updateUser = async (id, email, password, pseudo, phoneNumber, hasUploadedProfilePicture, isAdmin, client) => {
    return await client.query(`UPDATE "user" SET email = $1, password = $2, pseudo = $3, phoneNumber = $4, hasUploadedProfilePicture = $5, isAdmin = $6 WHERE id = $7`, [email, password, pseudo, phoneNumber, hasUploadedProfilePicture, isAdmin, id]);
}

module.exports.deleteUser = async (id, client) => {
    return await client.query(`DELETE FROM "user" WHERE id = $1`, [id]);
}

module.exports.emailExists = async (email, client) => {
    const { rows } = await client.query(`SELECT COUNT(*) FROM "user" WHERE email = $1`, [email]);
    return rows[0].count > 0;
}

module.exports.pseudoExists = async (pseudo, client) => {
    const { rows } = await client.query(`SELECT COUNT(*) FROM "user" WHERE pseudo = $1`, [pseudo]);
    return rows[0].count > 0;
}
