const pool = require('../model/database');
const TownModel = require('../model/town');

/***************** CRUD for town *****************/

module.exports.getAllTowns = async (req, res) => {
    const client = await pool.connect();

    try {

        const {rows: towns} = await TownModel.getAllTowns(client);

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

module.exports.townExists = async (req, res) => {
    const client = await pool.connect();
    const name = req.query.name;
    const zipCode = req.query.zipCode;

    try {

        if (name === undefined || zipCode === undefined) {
            res.sendStatus(400);
            return;
        }

        res.json(await TownModel.townExists(name, zipCode, client));

    } catch (error) {

        console.error(error);
        res.sendStatus(500);

    } finally {
        client.release();
    }
}

module.exports.postTown = async (req, res) => {
    const client = await pool.connect();
    const { name, zipCode } = req.body;

    try {

        if ( name === undefined || zipCode === undefined ) {
            res.sendStatus(400);
            return;
        }

        await TownModel.postTown(name, zipCode, client);
        res.sendStatus(201);

    } catch (error) {

        console.error(error);
        res.sendStatus(500);

    } finally {

        client.release();

    }
}

/************************************************/

