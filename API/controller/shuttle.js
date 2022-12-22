const pool = require('../model/database');
const ShuttleModel = require('../model/shuttle');

module.exports.getShuttles = async (req, res) => {
    const client = await pool.connect();

    try {

        const {rows: shuttles} = await ShuttleModel.getShuttles(client);

        if (shuttles == undefined) {
            res.sendStatus(404);
            return;
        }

        res.json(shuttles);

    } catch (error) {
        console.error(error);
        res.sendStatus(500);
    } finally {
        client.release();
    }
}