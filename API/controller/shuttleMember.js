const pool = require('../model/database');
const ShuttleMemberModel = require('../model/shuttleMember');

module.exports.findOne = async (req, res) => {
    const client = await pool.connect();
    const id = req.params.id;

    try {

        if (isNaN(id)) {
            res.sendStatus(400);
            return;
        }
        
        const {rows: shuttleMembers} = await ShuttleMemberModel.findOne(id, client);

        const shuttleMember = shuttleMembers[0];

        if (shuttleMember === undefined) {
            res.sendStatus(404);
            return;
        }

        res.json(shuttleMember);

    } catch (error) {

        console.error(error);
        res.sendStatus(500);

    } finally {
        client.release();
    }
}