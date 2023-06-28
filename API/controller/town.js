const pool = require('../model/database');
const TownModel = require('../model/town');

/***************** CRUD for town *****************/

module.exports.findAll = async (req, res) => {
    const client = await pool.connect();

    try {

        const {rows: towns} = await TownModel.findAll(client);

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

module.exports.create = async (req, res) => {
    const client = await pool.connect();
    const { name, zipCode } = req.body;

    try {

        if ( name === undefined || zipCode === undefined ) {

            res.sendStatus(400);
            return;
            
        }

        await TownModel.create(name, zipCode, client);

        res.sendStatus(201);

    } catch (error) {

        console.error(error);
        res.sendStatus(500);

    } finally {

        client.release();

    }
}

module.exports.delete = async (req, res) => {
    const client = await pool.connect();
    const { name, zipCode } = req.query;

    try {

        if ( name === undefined || zipCode === undefined ) {
            res.sendStatus(400);
            return;
        }

        await TownModel.delete(name, zipCode, client);

    } catch (error) {

        console.error(error);
        res.sendStatus(500);

    } finally {
        client.release();
    }
}

/************************************************/

