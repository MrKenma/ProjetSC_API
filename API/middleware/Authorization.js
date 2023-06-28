module.exports.mustBeAdmin = async (req, res, next) => {
    
    if (req.session === undefined || !req.session.authLevel) {
        res.sendStatus(403);
        return;
    }
       
    next();
}

