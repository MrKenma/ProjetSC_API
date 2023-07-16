module.exports.mustBeAdmin = async (req, res, next) => {
    
    console.log(req.session);
    
    if (req.session === undefined || req.session.authLevel !== 'admin') {
        res.sendStatus(403);
        return;
    }
       
    next();
}

module.exports.mustBePartier = async (req, res, next) => {

    if (req.session === undefined || req.session.authLevel !== 'partier') {
        res.sendStatus(403);
        return;
    }
       
    next();
}

module.exports.mustBeOrganization = async (req, res, next) => {
    
        if (req.session === undefined || req.session.authLevel !== 'organization') {
            res.sendStatus(403);
            return;
        }
        
        next();
}

module.exports.mustBeAdminOrOrganization = async (req, res, next) => {
        
    if (req.session === undefined || (req.session.authLevel !== 'admin' && req.session.authLevel !== 'organization')) {
        res.sendStatus(403);
        return;
    }
    
    next();
}

module.exports.mustBeAdminOrPartier = async (req, res, next) => {

    if (req.session === undefined || (req.session.authLevel !== 'admin' && req.session.authLevel !== 'partier')) {
        res.sendStatus(403);
        return;
    }
    
    next();
}

module.exports.mustBeAdminOrOrganizationOrPartier = async (req, res, next) => {

    if (req.session === undefined || (req.session.authLevel !== 'admin' && req.session.authLevel !== 'organization' && req.session.authLevel !== 'partier')) {
        res.sendStatus(403);
        return;
    }
    
    next();
}



