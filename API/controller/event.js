const pool = require('../model/database');
const EventModel = require('../model/event');

module.exports.getEvent = async (req, res) => {
    const client = await pool.connect();
    const id = req.params.id;

    try {
        const {rows: events} = await EventModel.getEvent(id, client);
        const event = events[0];
        if (event !== undefined) {
            res.json(event);
        } else {
            res.sendStatus(404);
        }
    } catch (error) {
        console.error(error);
        res.sendStatus(500);
    } finally {
        client.release();
    }
}

module.exports.getEvents = async (req, res) => {
    const client = await pool.connect();

    try {
        const {rows: events} = await EventModel.getEvents(client);
        if (events !== undefined) {
            res.json(events);
        } else {
            res.sendStatus(404);
        }
    } catch (error) {
        console.error(error);
        res.sendStatus(500);
    } finally {
        client.release();
    }
}

module.exports.getEventsByTown = async (req, res) => {
    const client = await pool.connect();
    const { name, zipcode } = req.body;

    try {
        const {rows: events} = await EventModel.getEventsByTown(name, zipcode, client);

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

module.exports.getEventsByOrganization = async (req, res) => {
    const client = await pool.connect();
    const organizationId = req.params.organizationId;

    try {
        const {rows: events} = await EventModel.getEventsByOrganization(organizationId, client);

        if (events == undefined) {
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

module.exports.postEvent = async (req, res) => {
    const client = await pool.connect();
    const {name, description, nameAndNumStreet, departingPoint, startDateAndTime, endDateAndTime, organizationId, addressTown, addressZipCode} = req.body;

    try {
        await EventModel.postEvent(name, description, nameAndNumStreet, departingPoint, startDateAndTime, endDateAndTime, organizationId, addressTown, addressZipCode, client);
        res.sendStatus(201);
    } catch (error) {
        console.error(error);
        res.sendStatus(500);
    } finally {
        client.release();
    }
}

module.exports.updateEvent = async (req, res) => {
    const client = await pool.connect();
    const {id, name, description, nameAndNumStreet, departingPoint, startDateAndTime, endDateAndTime, organizationId, addressTown, addressZipCode} = req.body;

    try {
        await EventModel.updateEvent(id, name, description, nameAndNumStreet, departingPoint, startDateAndTime, endDateAndTime, organizationId, addressTown, addressZipCode, client);
        res.sendStatus(204);
    } catch (error) {
        console.error(error);
        res.sendStatus(500);
    } finally {
        client.release();
    }
}

module.exports.deleteEvent = async (req, res) => {
    const client = await pool.connect();
    const id = req.params.id;

    try {
        await EventModel.deleteEvent(id, client);
        res.sendStatus(204);
    } catch (error) {
        console.error(error);
        res.sendStatus(500);
    } finally {
        client.release();
    }
}