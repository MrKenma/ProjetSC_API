module.exports.getShuttleMembers = async (client) => {
    return await client.query("SELECT * FROM shuttleMember");
}