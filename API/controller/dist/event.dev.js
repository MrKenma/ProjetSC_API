"use strict";

var pool = require('../model/database');

var sequelize = require('../ORM/sequelize');

var EventModel = require('../model/event');

var EventORM = require('../ORM/model/event');

var OrganizationORM = require('../ORM/model/organization');

var UserORM = require('../ORM/model/user');

var ShuttleORM = require('../ORM/model/shuttle');

var ShuttleMemberORM = require('../ORM/model/shuttleMember');
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
 *          content:
 *              application/json:
 *               schema:
 *                $ref: '#/components/schemas/Event' 
 */


module.exports.getAllEvents = function _callee(req, res) {
  var client, _ref, events;

  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.next = 2;
          return regeneratorRuntime.awrap(pool.connect());

        case 2:
          client = _context.sent;
          _context.prev = 3;
          _context.next = 6;
          return regeneratorRuntime.awrap(EventModel.getAllEvents(client));

        case 6:
          _ref = _context.sent;
          events = _ref.rows;

          if (!(events === undefined)) {
            _context.next = 11;
            break;
          }

          res.sendStatus(404);
          return _context.abrupt("return");

        case 11:
          res.json(events);
          _context.next = 18;
          break;

        case 14:
          _context.prev = 14;
          _context.t0 = _context["catch"](3);
          console.error(_context.t0);
          res.sendStatus(500);

        case 18:
          _context.prev = 18;
          client.release();
          return _context.finish(18);

        case 21:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[3, 14, 18, 21]]);
};
/**
 * @swagger
 * components:
 *  responses:
 *      EventFound:
 *          description: Renvoie un événement
 *          content:
 *           application/json:
 *            schema:
 *              $ref: '#/components/schemas/Event'
 *      EventNotFound:
 *          description: L'événement n'existe pas
 *      EventIdNotANumber:
 *          description: L'id de l'événement n'est pas un nombre
 */


module.exports.getEvent = function _callee2(req, res) {
  var client, id, _ref2, events, event;

  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.next = 2;
          return regeneratorRuntime.awrap(pool.connect());

        case 2:
          client = _context2.sent;
          id = req.params.id;
          _context2.prev = 4;

          if (!isNaN(id)) {
            _context2.next = 8;
            break;
          }

          res.sendStatus(400);
          return _context2.abrupt("return");

        case 8:
          _context2.next = 10;
          return regeneratorRuntime.awrap(EventModel.getEvent(id, client));

        case 10:
          _ref2 = _context2.sent;
          events = _ref2.rows;
          event = events[0];

          if (!(event === undefined)) {
            _context2.next = 16;
            break;
          }

          res.sendStatus(404);
          return _context2.abrupt("return");

        case 16:
          res.json(event);
          _context2.next = 23;
          break;

        case 19:
          _context2.prev = 19;
          _context2.t0 = _context2["catch"](4);
          console.error(_context2.t0);
          res.sendStatus(500);

        case 23:
          _context2.prev = 23;
          client.release();
          return _context2.finish(23);

        case 26:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[4, 19, 23, 26]]);
};
/**
 * @swagger
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
 *                  $ref: '#/components/schemas/Event'
 *                  required:
 *                      - name
 *                      - description
 *                      - nameandnumstreet
 *                      - departingpoint
 *                      - startdatetime
 *                      - enddatetime
 *                      - organizationid
 *                      - addresstown
 *                      - addresszipcode
 */


module.exports.postEvent = function _callee3(req, res) {
  var client, _req$body, name, description, nameandnumstreet, departingpoint, startdatetime, enddatetime, addresstown, addresszipcode, organizationid, nameExists;

  return regeneratorRuntime.async(function _callee3$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.next = 2;
          return regeneratorRuntime.awrap(pool.connect());

        case 2:
          client = _context3.sent;
          _req$body = req.body, name = _req$body.name, description = _req$body.description, nameandnumstreet = _req$body.nameandnumstreet, departingpoint = _req$body.departingpoint, startdatetime = _req$body.startdatetime, enddatetime = _req$body.enddatetime, addresstown = _req$body.addresstown, addresszipcode = _req$body.addresszipcode;
          organizationid = parseInt(req.body.organizationid);
          _context3.prev = 5;

          if (!(name === undefined || description === undefined || nameandnumstreet === undefined || departingpoint === undefined || startdatetime === undefined || enddatetime === undefined || organizationid === undefined || addresstown === undefined || addresszipcode === undefined)) {
            _context3.next = 9;
            break;
          }

          res.sendStatus(400);
          return _context3.abrupt("return");

        case 9:
          _context3.next = 11;
          return regeneratorRuntime.awrap(EventModel.nameExists(name, client));

        case 11:
          nameExists = _context3.sent;

          if (!nameExists) {
            _context3.next = 15;
            break;
          }

          res.status(409).send('Event name already exists');
          return _context3.abrupt("return");

        case 15:
          _context3.next = 17;
          return regeneratorRuntime.awrap(EventModel.postEvent(name, description, nameandnumstreet, departingpoint, startdatetime, enddatetime, organizationid, addresstown, addresszipcode, client));

        case 17:
          res.sendStatus(201);
          _context3.next = 24;
          break;

        case 20:
          _context3.prev = 20;
          _context3.t0 = _context3["catch"](5);
          console.error(_context3.t0);
          res.sendStatus(500);

        case 24:
          _context3.prev = 24;
          client.release();
          return _context3.finish(24);

        case 27:
        case "end":
          return _context3.stop();
      }
    }
  }, null, null, [[5, 20, 24, 27]]);
};
/**
 * @swagger
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
 *              schema:
 *                  $ref: '#/components/schemas/Event'
 *              required:
 *                  - id
 */


module.exports.updateEvent = function _callee4(req, res) {
  var client, id, _ref3, events, event, _req$body2, name, description, nameandnumstreet, departingpoint, startdatetime, enddatetime, organizationid, addresstown, addresszipcode, updatedEvent;

  return regeneratorRuntime.async(function _callee4$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          _context4.next = 2;
          return regeneratorRuntime.awrap(pool.connect());

        case 2:
          client = _context4.sent;
          id = parseInt(req.body.id);
          _context4.prev = 4;

          if (!isNaN(id)) {
            _context4.next = 8;
            break;
          }

          res.sendStatus(400);
          return _context4.abrupt("return");

        case 8:
          _context4.next = 10;
          return regeneratorRuntime.awrap(EventModel.getEvent(id, client));

        case 10:
          _ref3 = _context4.sent;
          events = _ref3.rows;
          event = events[0];

          if (!(event === undefined)) {
            _context4.next = 16;
            break;
          }

          res.sendStatus(404);
          return _context4.abrupt("return");

        case 16:
          _req$body2 = req.body, name = _req$body2.name, description = _req$body2.description, nameandnumstreet = _req$body2.nameandnumstreet, departingpoint = _req$body2.departingpoint, startdatetime = _req$body2.startdatetime, enddatetime = _req$body2.enddatetime, organizationid = _req$body2.organizationid, addresstown = _req$body2.addresstown, addresszipcode = _req$body2.addresszipcode;
          updatedEvent = [name || event.name, description || event.description, nameandnumstreet || event.nameandnumstreet, departingpoint || event.departingpoint, startdatetime || event.startdatetime, enddatetime || event.enddatetime, organizationid || event.organizationid, addresstown || event.addresstown, addresszipcode || event.addresszipcode];
          _context4.next = 20;
          return regeneratorRuntime.awrap(EventModel.updateEvent.apply(EventModel, [id].concat(updatedEvent, [client])));

        case 20:
          res.sendStatus(204);
          _context4.next = 27;
          break;

        case 23:
          _context4.prev = 23;
          _context4.t0 = _context4["catch"](4);
          console.error(_context4.t0);
          res.sendStatus(500);

        case 27:
          _context4.prev = 27;
          client.release();
          return _context4.finish(27);

        case 30:
        case "end":
          return _context4.stop();
      }
    }
  }, null, null, [[4, 23, 27, 30]]);
};
/**
 * @swagger
 * components:
 *  responses:
 *      EventDeleted:
 *          description: L'événement a été supprimé
 *      EventNotFound:
 *          description: L'événement n'existe pas
 *      EventIdNotANumber:
 *          description: L'id de l'événement n'est pas un nombre
 */


module.exports.deleteEvent = function _callee5(req, res) {
  var client, id, _EventModel$getEvent, events, event;

  return regeneratorRuntime.async(function _callee5$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          _context5.next = 2;
          return regeneratorRuntime.awrap(pool.connect());

        case 2:
          client = _context5.sent;
          id = parseInt(req.params.id);
          _context5.prev = 4;

          if (!isNaN(id)) {
            _context5.next = 8;
            break;
          }

          res.sendStatus(400);
          return _context5.abrupt("return");

        case 8:
          _EventModel$getEvent = EventModel.getEvent(id, client), events = _EventModel$getEvent.rows;
          event = events[0];

          if (!(event === undefined)) {
            _context5.next = 13;
            break;
          }

          res.sendStatus(404);
          return _context5.abrupt("return");

        case 13:
          _context5.next = 15;
          return regeneratorRuntime.awrap(EventModel.deleteEvent(id, client));

        case 15:
          res.sendStatus(204);
          _context5.next = 22;
          break;

        case 18:
          _context5.prev = 18;
          _context5.t0 = _context5["catch"](4);
          console.error(_context5.t0);
          res.sendStatus(500);

        case 22:
          _context5.prev = 22;
          client.release();
          return _context5.finish(22);

        case 25:
        case "end":
          return _context5.stop();
      }
    }
  }, null, null, [[4, 18, 22, 25]]);
};
/**
 * @swagger
 * components:
 *  responses:
 *      NameExists:
 *          description: Le nom existe déjà
 *      NameMissing:
 *          description: Le nom est manquant
 */


module.exports.nameExists = function _callee6(req, res) {
  var client, name;
  return regeneratorRuntime.async(function _callee6$(_context6) {
    while (1) {
      switch (_context6.prev = _context6.next) {
        case 0:
          _context6.next = 2;
          return regeneratorRuntime.awrap(pool.connect());

        case 2:
          client = _context6.sent;
          name = decodeURIComponent(req.params.name);
          _context6.prev = 4;

          if (!(name === undefined)) {
            _context6.next = 8;
            break;
          }

          res.sendStatus(400);
          return _context6.abrupt("return");

        case 8:
          _context6.t0 = res;
          _context6.next = 11;
          return regeneratorRuntime.awrap(EventModel.nameExists(name, client));

        case 11:
          _context6.t1 = _context6.sent;

          _context6.t0.json.call(_context6.t0, _context6.t1);

          _context6.next = 19;
          break;

        case 15:
          _context6.prev = 15;
          _context6.t2 = _context6["catch"](4);
          console.error(_context6.t2);
          res.sendStatus(500);

        case 19:
          _context6.prev = 19;
          client.release();
          return _context6.finish(19);

        case 22:
        case "end":
          return _context6.stop();
      }
    }
  }, null, null, [[4, 15, 19, 22]]);
};
/**
 * @swagger
 * components:
 *  responses:
 *      EventsFound:
 *          description: Les événements ont été trouvés
 *      EventsNotFound:
 *          description: Les événements n'ont pas été trouvés
 *      OrganizationIdNotANumber:
 *          description: L'id de l'organisation n'est pas un nombre
 */


module.exports.getEventsByOrganization = function _callee7(req, res) {
  var client, organizationId, _ref4, events;

  return regeneratorRuntime.async(function _callee7$(_context7) {
    while (1) {
      switch (_context7.prev = _context7.next) {
        case 0:
          _context7.next = 2;
          return regeneratorRuntime.awrap(pool.connect());

        case 2:
          client = _context7.sent;
          _context7.prev = 3;
          organizationId = req.params.id;

          if (!isNaN(organizationId)) {
            _context7.next = 8;
            break;
          }

          res.sendStatus(400);
          return _context7.abrupt("return");

        case 8:
          _context7.next = 10;
          return regeneratorRuntime.awrap(EventModel.getEventsByOrganization(organizationId, client));

        case 10:
          _ref4 = _context7.sent;
          events = _ref4.rows;

          if (!(events === undefined)) {
            _context7.next = 15;
            break;
          }

          res.sendStatus(404);
          return _context7.abrupt("return");

        case 15:
          res.json(events);
          _context7.next = 22;
          break;

        case 18:
          _context7.prev = 18;
          _context7.t0 = _context7["catch"](3);
          console.error(_context7.t0);
          res.sendStatus(500);

        case 22:
          _context7.prev = 22;
          client.release();
          return _context7.finish(22);

        case 25:
        case "end":
          return _context7.stop();
      }
    }
  }, null, null, [[3, 18, 22, 25]]);
};
/**
 * @swagger
 * components:
 *  responses:
 *      EventsFound:
 *          description: Les événements ont été trouvés
 *      EventsNotFound:
 *          description: Les événements n'ont pas été trouvés
 *      IdNotANumber:
 *          description: L'id n'est pas un nombre
 */


module.exports.search = function _callee8(req, res) {
  var id, events;
  return regeneratorRuntime.async(function _callee8$(_context8) {
    while (1) {
      switch (_context8.prev = _context8.next) {
        case 0:
          id = parseInt(req.params.id);
          _context8.prev = 1;

          if (!isNaN(id)) {
            _context8.next = 5;
            break;
          }

          res.sendStatus(400);
          return _context8.abrupt("return");

        case 5:
          _context8.next = 7;
          return regeneratorRuntime.awrap(EventORM.findAll({
            where: {
              id: id
            },
            include: [{
              model: OrganizationORM,
              include: [{
                model: UserORM
              }]
            }],
            attributes: {
              include: [[sequelize.literal('(SELECT COUNT(*) from shuttlemember INNER JOIN shuttle ON shuttle.eventid = event.id where shuttlemember.shuttleid = shuttle.id)'), 'attendees'], [sequelize.literal('(SELECT COUNT(*) from shuttlemember INNER JOIN shuttle ON shuttle.eventid = event.id where shuttlemember.shuttleid = shuttle.id AND shuttlemember.hasvalidated = true)'), 'validated'], [sequelize.literal('(SELECT COUNT(*) from shuttlemember INNER JOIN shuttle ON shuttle.eventid = event.id where shuttlemember.shuttleid = shuttle.id AND shuttlemember.hasarrivedsafely = true)'), 'arrived']]
            }
          }));

        case 7:
          events = _context8.sent;

          if (!(events === undefined)) {
            _context8.next = 11;
            break;
          }

          res.sendStatus(404);
          return _context8.abrupt("return");

        case 11:
          res.json(events);
          _context8.next = 18;
          break;

        case 14:
          _context8.prev = 14;
          _context8.t0 = _context8["catch"](1);
          console.error(_context8.t0);
          res.sendStatus(500);

        case 18:
        case "end":
          return _context8.stop();
      }
    }
  }, null, null, [[1, 14]]);
};