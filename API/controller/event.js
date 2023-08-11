const pool = require('../model/database');
const sequelize = require('../ORM/sequelize');
const EventModel = require('../model/event');
const ShuttleModel = require('../model/shuttle');
const ShuttleMemberModel = require('../model/shuttleMember');
const EventORM = require('../ORM/model/event');
const OrganizationORM = require('../ORM/model/organization');
const UserORM = require('../ORM/model/user');

/**
 * @swagger
 * components:
 *  schemas:
 *      Event:
 *          type: object
 *          properties:
 *              id:
 *                  type: integer
 *              name:
 *                  type: string
 *                  description: nom de l'événement
 *              description:
 *                  type: string
 *                  description: description de l'événement
 *              nameandnumstreet:
 *                  type: string
 *                  description: nom et numéro de rue de l'événement
 *              departingpoint:
 *                  type: string
 *                  description: point de départ de l'événement
 *              startdatetime:
 *                  type: string
 *                  description: date et heure de début de l'événement
 *              enddatetime:
 *                  type: string
 *                  description: date et heure de fin de l'événement
 *              organizationid:
 *                  type: integer
 *                  description: id de l'organisateur de l'événement
 *              addresstown:
 *                  type: string
 *                  description: ville de l'événement
 *              addresszipcode:
 *                  type: string
 *                  description: code postal de l'événement
 *          example:
 *            id: 1
 *            name: "Party de la rentrée"
 *            description: "Party de la rentrée des étudiants"
 *            nameandnumstreet: "123 rue de la rentrée"
 *            departingpoint: "devant le pavillon des sciences"
 *            startdatetime: "2020-09-01 20:00:00"
 *            enddatetime: "2020-09-02 03:00:00"
 *            organizationid: 1
 *            addresstown: "Sherbrooke"
 *            addresszipcode: "J1E 4K1"
 */

 
/**
 * @swagger
 * components:
 *  responses:
 *      AllEventsFound:
 *          description: Renvoie tous les événements
 */ 

module.exports.getAllEvents = async (req, res) => {

    const client = await pool.connect();

    try {

        const {rows: events} = await EventModel.getAllEvents(client);

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

/**
 * 
 * components:
 *  responses:
 *      EventFound:
 *          description: Renvoie un événement
 *      EventNotFound:
 *          description: L'événement n'existe pas
 *      EventIdNotANumber:
 *          description: L'id de l'événement n'est pas un nombre
 */

module.exports.getEvent = async (req, res) => {
    const client = await pool.connect();
    const id = req.params.id;

    try {

        if (isNaN(id)) {
            res.sendStatus(400);
            return;
        }

        const {rows: events} = await EventModel.getEvent(id, client);

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

/**
 * 
 * components:
 *  responses:
 *      EventCreated:
 *          description: L'événement a été créé
 *      EventNameAlreadyExists:
 *          description: Le nom de l'événement existe déjà
 *      CreateEventBadRequest:
 *          description: Mauvaise requête
 *  requestBodies:
 *      CreateEvent:
 *          description: L'événement à créer
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/Event'
 */

module.exports.postEvent = async (req, res) => {
    const client = await pool.connect();
    
    const { name, description, nameAndNumStreet, departingPoint, startDateTime, endDateTime, addressTown, addressZipCode } = req.body;
    const organizationId = parseInt(req.body.organizationId);

    try {
        
        if (name === undefined || description === undefined || nameAndNumStreet === undefined || departingPoint === undefined || startDateTime === undefined || endDateTime === undefined || organizationId === undefined || addressTown === undefined || addressZipCode === undefined) {
            res.sendStatus(400);
            return;
        }

        const nameExists = await EventModel.nameExists(name, client);

        if (nameExists) {
            res.status(409).send('Event name already exists');
            return;
        }

        await EventModel.postEvent(name, description, nameAndNumStreet, departingPoint, startDateTime, endDateTime, organizationId, addressTown, addressZipCode, client);
        res.sendStatus(201);

    } catch (error) {
        console.error(error);
        res.sendStatus(500);
    } finally {
        client.release();
    }
}

/**
 * 
 * components:
 *  responses:
 *      EventUpdated:
 *          description: L'événement a été mis à jour
 *      EventNotFound:
 *          description: L'événement n'existe pas
 *      EventIdNotANumber:
 *          description: L'id de l'événement n'est pas un nombre
 * requestBodies:
 *      UpdateEvent:
 *          description: L'événement à mettre à jour
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          id:
 *                              type: integer
 *                          name:
 *                              type: string
 *                              description: nom de l'événement
 *                          description:
 *                              type: string
 *                              description: description de l'événement
 *                          nameandnumstreet:
 *                              type: string
 *                              description: nom et numéro de rue de l'événement
 *                          departingpoint:
 *                              type: string
 *                              description: point de départ de l'événement
 *                          startdatetime:
 *                              type: string
 *                              description: date et heure de début de l'événement
 *                          enddatetime:
 *                              type: string
 *                              description: date et heure de fin de l'événement
 *                          organizationid:
 *                              type: integer
 *                              description: id de l'organisateur de l'événement
 *                          addresstown:
 *                              type: string
 *                              description: ville de l'événement
 *                          addresszipcode:
 *                              type: string
 *                              description: code postal de l'événement    
 *                      required:
 *                          - id
 */

module.exports.updateEvent = async (req, res) => {
    const client = await pool.connect();
    const id = parseInt(req.body.id);

    try {

        if (isNaN(id)) {
            res.sendStatus(400);
            return;
        }

        const { rows : events } = await EventModel.getEvent(id, client);
        const event = events[0];

        if (event === undefined) {
            res.sendStatus(404);
            return;
        }

        const { name, description, nameAndNumStreet, departingPoint, startDateTime, endDateTime, organizationId, addressTown, addressZipCode } = req.body;

        const updatedEvent = [
            name || event.name,
            description || event.description,
            nameAndNumStreet || event.nameandnumstreet,
            departingPoint || event.departingpoint,
            startDateTime || event.startdatetime,
            endDateTime || event.enddatetime,
            organizationId || event.organizationid,
            addressTown || event.addresstown,
            addressZipCode || event.addresszipcode
        ]

        await EventModel.updateEvent(id, ...updatedEvent, client);
        res.sendStatus(204);

    } catch (error) {

        console.error(error);
        res.sendStatus(500);

    } finally {
        client.release();
    }
}

/**
 * 
 * components:
 *  responses:
 *      EventDeleted:
 *          description: L'événement a été supprimé
 *      EventNotFound:
 *          description: L'événement n'existe pas
 *      EventIdNotANumber:
 *          description: L'id de l'événement n'est pas un nombre
 */

module.exports.deleteEvent = async (req, res) => {
    const client = await pool.connect();
    const id = req.params.id;

    try {

        if (isNaN(id)) {
            res.sendStatus(400);
            return;
        }

        console.log(id);

        const { rows: events } = await EventModel.getEvent(id, client);
        const event = events[0];

        if (event === undefined) {
            res.sendStatus(404);
            return;
        }

        await EventModel.deleteEvent(id, client);

        res.sendStatus(204); 

    } catch (error) {

        console.error(error);
        res.sendStatus(500);

    } finally {
        client.release();
    }
}

/**
 * 
 * components:
 *  responses:
 *      NameExists:
 *          description: Le nom existe déjà
 *      NameMissing:
 *          description: Le nom est manquant
 */

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

/**
 * 
 * components:
 *  responses:
 *      EventsFound:
 *          description: Les événements ont été trouvés
 *      EventsNotFound:
 *          description: Les événements n'ont pas été trouvés
 *      OrganizationIdNotANumber:
 *          description: L'id de l'organisation n'est pas un nombre
 */
        
module.exports.getEventsByOrganization = async (req, res) => {
    const client = await pool.connect();

    try {
        const organizationId = req.params.id;

        if (isNaN(organizationId)) {
            res.sendStatus(400);
            return;
        }

        const {rows: events} = await EventModel.getEventsByOrganization(organizationId, client);

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

/**
 * 
 * components:
 *  responses:
 *      EventsFound:
 *          description: Les événements ont été trouvés
 *      EventsNotFound:
 *          description: Les événements n'ont pas été trouvés
 *      IdNotANumber:
 *          description: L'id n'est pas un nombre
 */

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