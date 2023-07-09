const pool = require('../model/database');
const ShuttleModel = require('../model/shuttle');
const ShuttleORM = require('../ORM/model/shuttle');
const ShuttleMemberORM = require('../ORM/model/shuttleMember');
const PartierORM = require('../ORM/model/partier');
const UserORM = require('../ORM/model/user');

module.exports.findAll = async (req, res) => {
    const client = await pool.connect();

    try {

        const {rows: shuttles} = await ShuttleModel.findAll(client);

        if (shuttles === undefined) {
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

module.exports.findOne = async (req, res) => {
    const client = await pool.connect();
    const id = req.params.id;

    try {

        if (isNaN(id)) {
            res.sendStatus(400);
            return;
        }
        
        const {rows: shuttles} = await ShuttleModel.findOne(id, client);

        const shuttle = shuttles[0];

        if (shuttle === undefined) {
            res.sendStatus(404);
            return;
        }

        res.json(shuttle);

    } catch (error) {

        console.error(error);
        res.sendStatus(500);

    } finally {
        client.release();
    }
}

module.exports.findByEvent = async (req, res) => {
    const client = await pool.connect();
    const eventID = parseInt(req.params.id);

    try {

        if (isNaN(eventID)) {
            console.log("eventID is NaN");
            res.sendStatus(400);
            return;
        }

        // findAll shuttle by event with all shuttleMember includes
        const shuttles = await ShuttleORM.findAll({
            include: [
                {
                    model : ShuttleMemberORM,
                    required: true
                }, {
                    model : PartierORM,
                    required : true
                }, {
                    model: UserORM,
                    required: true
                }
            ],
            where : {
                eventid : eventID
            }
        });

        if (shuttles === undefined) {
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

module.exports.create = async (req, res) => {
    const client = await pool.connect();
    const { departureTime, eventID, destinationTown, destinationZipCode} = req.body;

    try {
        const {rows: shuttles} = await ShuttleModel.create(req.body, client);

        const shuttle = shuttles[0];

        if (shuttle === undefined) {
            res.sendStatus(404);
            return;
        }

        res.json(shuttle);

    } catch (error) {
        console.error(error);
        res.sendStatus(500);
    } finally {
        client.release();
    }
}