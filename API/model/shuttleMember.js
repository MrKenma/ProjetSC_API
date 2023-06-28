module.exports.findAll = async (client) => {
    return await client.query('SELECT * FROM shuttle');
}

module.exports.delete = async (id, client) => {
    return await client.query('DELETE FROM shuttle WHERE id = $1', [id]);
}