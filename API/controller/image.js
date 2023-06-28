const ImageModel = require('../model/image');

module.exports.getUuidFromEmail = (req, res) => {
    const email = req.params.email;

    if (email === undefined || typeof email !== 'string') {
        res.sendStatus(400);
        return;
    }

    const uuid = ImageModel.getUuidFromEmail(email);
        
    if (uuid === undefined) {
        res.sendStatus(500);
        return;
    }
            
    res.json(uuid);
        
} 