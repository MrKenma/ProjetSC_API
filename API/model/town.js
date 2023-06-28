module.exports.findAll = async (client) => {
    return await client.query('SELECT * FROM town');
}

module.exports.create = async (name, zipCode, client) => {
    return await client.query("INSERT INTO town (name, zipCode) VALUES ($1, $2)", [name, zipCode]);
}

module.exports.delete = async (name, zipCode, client) => {
    return await client.query("DELETE FROM town WHERE name = $1 AND zipCode = $2", [name, zipCode]);
}
