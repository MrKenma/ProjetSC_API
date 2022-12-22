module.exports.getShuttles = async (client) => {
    return await client.query("SELECT * FROM shuttle");
}
