/**
* @swagger
* components:
*   responses:
*       mustBeAdmin:
*           description: L'action demandée ne peut être réalisée que par un administrateur
*/

module.exports.mustBeAdmin = async (req, res, next) => {
    
    console.log(req.session);
    
    if (req.session === undefined || req.session.authLevel !== 'admin') {
        res.sendStatus(403);
        return;
    }
       
    next();
}

/**
* @swagger
* components:
*   responses:
*       mustBePartier:
*           description: L'action demandée ne peut être réalisée que par un partier
*/


module.exports.mustBePartier = async (req, res, next) => {

    if (req.session === undefined || req.session.authLevel !== 'partier') {
        res.sendStatus(403);
        return;
    }
       
    next();
}

/**
* @swagger
* components:
*   responses:
*       mustBeOrganization:
*           description: L'action demandée ne peut être réalisée que par un organisateur
*/

module.exports.mustBeOrganization = async (req, res, next) => {
    
        if (req.session === undefined || req.session.authLevel !== 'organization') {
            res.sendStatus(403);
            return;
        }
        
        next();
}

/**
* @swagger
* components:
*   responses:
*       mustBeAdminOrOrganization:
*           description: L'action demandée ne peut être réalisée que par un administrateur ou une organisation
*/

module.exports.mustBeAdminOrOrganization = async (req, res, next) => {
        
    if (req.session === undefined || (req.session.authLevel !== 'admin' && req.session.authLevel !== 'organization')) {
        res.sendStatus(403);
        return;
    }
    
    next();
}

/**
* @swagger
* components:
*   responses:
*       mustBeAdminOrPartier:
*           description: L'action demandée ne peut être réalisée que par un administrateur ou un partier
*/

module.exports.mustBeAdminOrPartier = async (req, res, next) => {

    if (req.session === undefined || (req.session.authLevel !== 'admin' && req.session.authLevel !== 'partier')) {
        res.sendStatus(403);
        return;
    }
    
    next();
}

/**
* @swagger
* components:
*   responses:
*       mustBeAdminOrOrganizationOrPartier:
*           description: L'action demandée ne peut être réalisée que par un administrateur ou une organisation ou un partier 
*/

module.exports.mustBeAdminOrOrganizationOrPartier = async (req, res, next) => {

    if (req.session === undefined || (req.session.authLevel !== 'admin' && req.session.authLevel !== 'organization' && req.session.authLevel !== 'partier')) {
        res.sendStatus(403);
        return;
    }
    
    next();
}



