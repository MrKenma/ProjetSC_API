const pool = require('../model/database');
const sequelize = require('../ORM/sequelize');
const ShuttleModel = require('../model/shuttle');
const ShuttleORM = require('../ORM/model/shuttle');
const ShuttleMemberORM = require('../ORM/model/shuttleMember');
const PartierORM = require('../ORM/model/partier');
const UserORM = require('../ORM/model/user');
const EventORM = require('../ORM/model/event');

module.exports.getAllShuttles = async (req, res) => {
    const client = await pool.connect();

    try {

        const {rows: shuttles} = await ShuttleModel.getAllShuttles(client);

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

module.exports.getShuttle = async (req, res) => {
    const client = await pool.connect();
    const id = req.params.id;

    try {

        if (isNaN(id)) {
            res.sendStatus(400);
            return;
        }
        
        const {rows: shuttles} = await ShuttleModel.getShuttle(id, client);

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

module.exports.search = async (req, res) => {
    const client = await pool.connect();

    const eventid = parseInt(req.query.eventid);
    const destinationtown = req.query.destinationtown;
    const destinationzipcode = req.query.destinationzipcode;

    try {

        if (isNaN(eventid)) {
            console.log("eventID is NaN");
            res.sendStatus(400);
            return;
        }

        // getAllShuttles shuttle by event with all shuttleMember includes
        const shuttles = await ShuttleORM.findAll({
            where: {
                eventid: eventid,
                destinationtown: destinationtown,
                destinationzipcode: destinationzipcode
            },
            include: [
                {
                    model: ShuttleMemberORM,
                    include: [
                        {
                            model: PartierORM,
                            include: [
                                {
                                    model: UserORM
                                }
                            ]
                        }
                    ]
                }
            ]
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

module.exports.search2 = async (req, res) => {

    const partierid = parseInt(req.query.partierid);

    try {

        if (isNaN(partierid)) {
            console.log("partierID is NaN");
            res.sendStatus(400);
            return;
        }

        const shuttles = await ShuttleORM.findAll({
            include: [
                {
                    model: EventORM
                },
                {
                    model: ShuttleMemberORM,
                    where: {
                        partierid: partierid
                    }
                }
            ],
            attributes: {
                include: [
                  [sequelize.literal('(SELECT COUNT(*) FROM "shuttlemember" WHERE "shuttlemember"."shuttleid" = "shuttle"."id")'), 'totalPeople']
                ]
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

    }
}


module.exports.postShuttle = async (req, res) => {
    const client = await pool.connect();
    const { departureTime, eventID, destinationTown, destinationZipCode} = req.body;

    try {
        const {rows: shuttles} = await ShuttleModel.postShuttle(req.body, client);

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