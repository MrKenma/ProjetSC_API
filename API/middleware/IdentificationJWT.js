require('dotenv').config();
const process = require('process');
const jwt = require('jsonwebtoken');

// le secret token est "secret"

module.exports.identification = async (req, res, next) => {

    const headerAuth = req.get('authorization');

    if (headerAuth === undefined || !headerAuth.includes('Bearer ')) {
        res.sendStatus(401);
        return;
    }

    const jwtToken = headerAuth.split(' ')[1];

    try {

        const decodedJwtToken = jwt.verify(jwtToken, process.env.SECRET_TOKEN);
        
        req.session = decodedJwtToken.value;
        req.session.authLevel = decodedJwtToken.status;
        next();

    } catch (error) {
        console.error(error.message);
        res.status(401).json(error.message);
    }

}