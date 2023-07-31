"use strict";

var EventController = require('../controller/event');

var Router = require('express-promise-router');

var router = new Router();

var Authorization = require('../middleware/Authorization');

var IdentificationJWT = require('../middleware/IdentificationJWT');
/**
 * @swagger
 * /event/:
 *  get:
 *      tags:
 *          - Event
 *      security:
 *          - bearerAuth: []
 *      description: Récupère tous les événements
 *      responses:
 *          200:
 *              $ref: '#/components/responses/EventsFound'
 *          403:
 *              $ref: '#/components/responses/mustBeAdminOrOrganizationOrPartier'
 *          404:
 *              $ref: '#/components/responses/EventsNotFound'  
 *          500:
 *              description: Erreur serveur
 */


router.get('/', IdentificationJWT.identification, Authorization.mustBeAdminOrOrganizationOrPartier, EventController.getAllEvents);
/**
 * @swagger
 * /event/search/{id}:
 *  get:
 *      tags:
 *          - Event
 *      security:
 *          - bearerAuth: []
 *      description: Recherche un événement par son id
 *      parameters:
 *          - name: id
 *          description: id de l'événement
 *          in: path
 *          required: true
 *          schema:
 *          type: integer
 *      responses:
 *          200:
 *              $ref: '#/components/responses/EventFound'
 *          403:
 *              $ref: '#/components/responses/mustBeAdminOrOrganizationOrPartier'
 *          404:
 *              $ref: '#/components/responses/EventNotFound'
 *          500:
 *              description: Erreur serveur
 */

router.get('/search/:id', IdentificationJWT.identification, Authorization.mustBeAdminOrOrganizationOrPartier, EventController.search);
/**
 * @swagger
 * /event/organization/{id}:
 *  get:
 *      tags:
 *          - Event
 *      security:
 *          - bearerAuth: []
 *      description: Récupère tous les événements d'une organisation
 *      parameters:
 *          - name: id
 *          description: id de l'organisation
 *          in: path
 *          required: true
 *          schema:
 *              type: integer
 *      responses:
 *          200:
 *              $ref: '#/components/responses/EventsFound'
 *          403:
 *              $ref: '#/components/responses/mustBeAdminOrOrganization'
 *          400:
 *              $ref: '#/components/responses/OrganizationIdNotANumber'
 *          401:
 *              $ref: '#/components/responses/UnauthorizedJWT'
 *          404:
 *              $ref: '#/components/responses/EventsNotFound'
 *          500:
 *              description: Erreur serveur
 */

router.get('/organization/:id', IdentificationJWT.identification, Authorization.mustBeAdminOrOrganization, EventController.getEventsByOrganization);
/**
 * @swagger
 *  /event/{id}:
 *  get:
 *      tags:
 *          - Event
 *      security:
 *          - bearerAuth: []
 *      description: Récupère un événement par son id
 *      parameters:
 *          - name: id
 *          description: id de l'événement
 *          in: path
 *          required: true
 *          schema:
 *              type: integer
 *      responses:
 *          200:
 *              $ref: '#/components/responses/EventFound'
 *          403:
 *              $ref: '#/components/responses/mustBeAdminOrOrganizationOrPartier'
 *          404:
 *              $ref: '#/components/responses/EventNotFound'
 *          500:
 *              description: Erreur serveur
 */

router.get('/:id', IdentificationJWT.identification, Authorization.mustBeAdminOrOrganization, EventController.getEvent);
/**
 * @swagger
 *  /event/nameExists/{name}:
 *      get:
 *          tags:
 *              - Event
 *          security:
 *              - bearerAuth: []
 *          description: Vérifie si le nom d'un événement existe déjà
 *          parameters:
 *              - name: name
 *              description: nom de l'événement
 *              in: path
 *              required: true
 *              schema:
 *                  type: string
 *              responses:
 *                  200:
 *                      $ref: '#/components/responses/NameExists'
 *                  403:
 *                      $ref: '#/components/responses/mustBeAdminOrOrganization'
 *                  400:
 *                      $ref: '#/components/responses/NameMissing'
 *                  401:
 *                      $ref: '#/components/responses/UnauthorizedJWT'
 *                  500:
 *                      description: Erreur serveur
 */

router.get('/nameExists/:name', IdentificationJWT.identification, Authorization.mustBeAdminOrOrganization, EventController.nameExists);
/**
 * @swagger
 *  /event/:
 *      post:
 *          tags:
 *              - Event
 *          security:
 *              - bearerAuth: []
 *          description: Créer un événement
 *          requestBody:
 *              content:
 *              application/json:
 *              schema:
 *                  $ref: '#/components/schemas/CreateEvent'
 *              responses:
 *                  201:
 *                      $ref: '#/components/responses/EventCreated'
 *                  403:
 *                      $ref: '#/components/responses/mustBeAdminOrOrganization'
 *                  400:
 *                      $ref: '#/components/responses/CreateEventBadRequest'
 *                  401:
 *                      $ref: '#/components/responses/UnauthorizedJWT'
 *                  500:
 *                      description: Erreur serveur
 *                  409:
 *                      $ref: '#/components/responses/EventNameAlreadyExists'
 */

router.post('/', IdentificationJWT.identification, Authorization.mustBeAdminOrOrganization, EventController.postEvent);
/**
 * @swagger
 *  /event/:
 *      patch:
 *          tags:
 *              - Event
 *          security:
 *              - bearerAuth: []
 *          description: Met à jour un événement
 *          requestBody:
 *              content:
 *                  application/json:
 *              schema:
 *                  $ref: '#/components/schemas/UpdateEvent'
 *              responses:
 *                  200:
 *                      $ref: '#/components/responses/EventUpdated'
 *                  403:
 *                      $ref: '#/components/responses/mustBeAdminOrOrganization'
 *                  400:
 *                      $ref: '#/components/responses/EventIdNotANumber'
 *                  401:
 *                      $ref: '#/components/responses/UnauthorizedJWT'
 *                  404:
 *                      $ref: '#/components/responses/EventNotFound'
 *                  500:
 *                      description: Erreur serveur
 */

router.patch('/', IdentificationJWT.identification, Authorization.mustBeAdmin, EventController.updateEvent);
/**
 * @swagger
 *  /event/{id}:
 *      delete:
 *          tags:
 *              - Event
 *          security:
 *              - bearerAuth: []
 *          description: Supprime un événement
 *          parameters:
 *              - name: id
 *              description: id de l'événement
 *              in: path
 *              required: true
 *              schema:
 *                  type: integer
 *              responses:
 *                  204:
 *                      $ref: '#/components/responses/EventDeleted'
 *                  403:
 *                      $ref: '#/components/responses/mustBeAdmin'
 *                  400:
 *                      $ref: '#/components/responses/EventIdNotANumber'
 *                  401:
 *                      $ref: '#/components/responses/UnauthorizedJWT'
 *                  404:
 *                      $ref: '#/components/responses/EventNotFound'
 *                  500:
 *                      description: Erreur serveur
 */

router["delete"]('/:id', IdentificationJWT.identification, Authorization.mustBeAdmin, EventController.deleteEvent);
module.exports = router;