const pool = require('../model/database');
const ShuttleMemberModel = require('../model/shuttleMember');

module.exports.getShuttleMembers = async (req, res) => {
    const client = await pool.connect();

    try {
        
        const {rows: shuttleMembers} = await ShuttleMemberModel.getShuttleMembers(client);

        if (shuttleMembers == undefined) {
            res.sendStatus(404);
            return;
        }

        res.json(shuttleMembers);

    } catch (error) {
        console.error(error);
        res.sendStatus(500);
    } finally {
        client.release();
    }
}