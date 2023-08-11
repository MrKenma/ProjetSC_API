module.exports.getAllTowns = async (client) => {
    return await client.query('SELECT * FROM town');
}

module.exports.townExists = async (name, zipCode, client) => {
    const { rows } = await client.query(`SELECT COUNT(*) FROM town WHERE name = $1 AND zipCode = $2`, [name, zipCode]);
    return rows[0].count > 0;
}

module.exports.postTown = async (name, zipCode, client) => {
    return await client.query("INSERT INTO town (name, zipCode) VALUES ($1, $2)", [name, zipCode]);
}
