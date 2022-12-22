const pool = require('../model/database');
const TownModel = require('../model/town');

module.exports.getTowns = async (req, res) => {
    const client = await pool.connect();

    try {
        
        const {rows: towns} = await TownModel.getTowns(client);

        if (towns === undefined) {
            res.sendStatus(404);
            return;
        }

        res.json(towns);

    } catch (error) {
        console.error(error);
        res.sendStatus(500);
    } finally {
        client.release();
    }
}
