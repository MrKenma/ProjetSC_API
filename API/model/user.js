const { getHash } = require("../utils/utils");

module.exports.create = async (email, password, pseudo, phoneNumber, hasUploadedProfilePicture, isAdmin, client) => {
    encryptedPassword = await getHash(password);
    return await client.query(`INSERT INTO "user" (email, password, pseudo, phoneNumber, hasUploadedProfilePicture, isAdmin) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id`, [email, encryptedPassword, pseudo, phoneNumber, hasUploadedProfilePicture, isAdmin]);
}

module.exports.findAll = async (client) => {
    return await client.query(`SELECT * FROM "user"`);
}

module.exports.findOne = async (id, client) => {
    return await client.query(`SELECT * FROM "user" WHERE id = $1`, [id]);
}

module.exports.findOneByEmail = async (email, client) => {
    return await client.query(`SELECT * FROM "user" WHERE email = $1`, [email]);
}

module.exports.update = async (id, email, password, pseudo, phoneNumber, hasUploadedProfilePicture, isAdmin, client) => {
    encryptedPassword = await getHash(password);
    return await client.query(`UPDATE "user" SET email = $1, password = $2, pseudo = $3, phoneNumber = $4, hasUploadedProfilePicture = $5, isAdmin = $6 WHERE id = $7`, [email, encryptedPassword, pseudo, phoneNumber, hasUploadedProfilePicture, isAdmin, id]);
}

module.exports.delete = async (id, client) => {
    return await client.query(`DELETE FROM "user" WHERE id = $1`, [id]);
}

module.exports.emailExists = async (email, client) => {
    return await client.query(`SELECT COUNT(*) FROM "user" WHERE email = $1`, [email]);
}

module.exports.pseudoExists = async (pseudo, client) => {
    return await client.query(`SELECT COUNT(*) FROM "user" WHERE pseudo = $1`, [pseudo]);
}
