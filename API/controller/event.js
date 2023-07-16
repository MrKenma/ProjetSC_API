const pool = require('../model/database');
const sequelize = require('../ORM/sequelize');
const EventModel = require('../model/event');
const EventORM = require('../ORM/model/event');
const OrganizationORM = require('../ORM/model/organization');
const UserORM = require('../ORM/model/user');
const ShuttleORM = require('../ORM/model/shuttle');
const ShuttleMemberORM = require('../ORM/model/shuttleMember');



module.exports.findAll = async (req, res) => {

    const client = await pool.connect();

    try {

        const {rows: events} = await EventModel.findAll(client);

        if (events === undefined) {
            res.sendStatus(404);
            return;
        }

        res.json(events);
        
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

        const {rows: events} = await EventModel.findOne(id, client);

        const event = events[0];

        if (event === undefined) {
            res.sendStatus(404);
            return;
        }

        res.json(event);
       
    } catch (error) {

        console.error(error);
        res.sendStatus(500);
        
    } finally {
        client.release();
    }
}

module.exports.create = async (req, res) => {
    const client = await pool.connect();
    // all lowercase variables names
    const { name, description, nameandnumstreet, departingpoint, startdatetime, enddatetime, addresstown, addresszipcode } = req.body;
    const organizationid = parseInt(req.body.organizationid);

    console.log(req.body);

    try {

        if (name === undefined || description === undefined || nameandnumstreet === undefined || departingpoint === undefined || startdatetime === undefined || enddatetime === undefined || organizationid === undefined || addresstown === undefined || addresszipcode === undefined) {
            res.sendStatus(400);
            return;
        }

        const { rows: events } = await EventModel.create(name, description, nameandnumstreet, departingpoint, startdatetime, enddatetime, organizationid, addresstown, addresszipcode, client);
        res.sendStatus(201);

    } catch (error) {
        console.error(error);
        res.sendStatus(500);
    } finally {
        client.release();
    }
}

module.exports.update = async (req, res) => {
}

module.exports.delete = async (req, res) => {
}

module.exports.nameExists = async (req, res) => {
    const client = await pool.connect();
    const name = decodeURIComponent(req.params.name);

    try {

        if (name === undefined) {
            res.sendStatus(400);
            return;
        }

        res.json(await EventModel.nameExists(name, client));

    } catch (error) {

        console.error(error);
        res.sendStatus(500);

    } finally {
        client.release();
    }

}
        
module.exports.findManyByOrganization = async (req, res) => {
    const client = await pool.connect();

    try {
        const organizationId = req.params.id;

        if (isNaN(organizationId)) {
            res.sendStatus(400);
            return;
        }

        const {rows: events} = await EventModel.findManyByOrganization(organizationId, client);

        if (events === undefined) {
            res.sendStatus(404);
            return;
        }

        res.json(events);

    } catch (error) {

        console.error(error);
        res.sendStatus(500);

    } finally {
        client.release();
    }
}

module.exports.search = async (req, res) => {
    const id = parseInt(req.params.id);

    try {
        
        if (isNaN(id)) {
            res.sendStatus(400);
            return;
        }

        const events = await EventORM.findAll({
            where: {
                id: id
            },
            include: [
                {
                    model: OrganizationORM,
                    include: [
                        {
                            model: UserORM,
                        }
                    ]
                }
            ],
            attributes: {
                include : [
                    [sequelize.literal('(SELECT COUNT(*) from shuttlemember INNER JOIN shuttle ON shuttle.eventid = event.id where shuttlemember.shuttleid = shuttle.id)'), 'attendees'],
                    [sequelize.literal('(SELECT COUNT(*) from shuttlemember INNER JOIN shuttle ON shuttle.eventid = event.id where shuttlemember.shuttleid = shuttle.id AND shuttlemember.hasvalidated = true)'), 'validated'],
                    [sequelize.literal('(SELECT COUNT(*) from shuttlemember INNER JOIN shuttle ON shuttle.eventid = event.id where shuttlemember.shuttleid = shuttle.id AND shuttlemember.hasarrivedsafely = true)'), 'arrived']
                ]
            }
        });

        if (events === undefined) {
            res.sendStatus(404);
            return;
        }

        res.json(events);

    } catch (error) {

        console.error(error);
        res.sendStatus(500);

    } 
}