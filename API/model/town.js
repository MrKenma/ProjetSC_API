module.exports.getTown = async (name, zipCode, client) => {
    return await client.query("SELECT * FROM town WHERE name = $1 AND zip_code = $2", [name, zipCode]);
}

// Get de tous les partiers
module.exports.getTowns = async (client) => {
    return await client.query("SELECT * FROM town");
}

module.exports.postTown = async (name, zipCode, client) => {
    return await client.query("INSERT INTO town (name, zip_code) VALUES ($1, $2)", [name, zipCode]);
}

module.exports.deleteTown = async (name, zipCode, client) => {
    return await client.query("DELETE FROM town WHERE name = $1 AND zip_code = $2", [name, zipCode]);
}
