const pool = require('../model/database');
const ShuttleMemberModel = require('../model/shuttleMember');
const ShuttleModel = require('../model/shuttle');

module.exports.findOne = async (req, res) => {
    const client = await pool.connect();
    const id = req.params.id;

    try {

        if (isNaN(id)) {
            res.sendStatus(400);
            return;
        }
        
        const {rows: shuttleMembers} = await ShuttleMemberModel.findOne(id, client);

        const shuttleMember = shuttleMembers[0];

        if (shuttleMember === undefined) {
            res.sendStatus(404);
            return;
        }

        res.json(shuttleMember);

    } catch (error) {

        console.error(error);
        res.sendStatus(500);

    } finally {
        client.release();
    }
}

module.exports.findAll = async (req, res) => {
    const client = await pool.connect();

    try {
        const {rows: shuttleMembers} = await ShuttleMemberModel.findAll(client);

        if (shuttleMembers === undefined) {
            res.sendStatus(404);
            return;
        }

        res.json(shuttleMembers);
    } catch (error) {
        console.error(error);
        res.sendStatus(500);
    } finally {
        client.release();
    }
}

module.exports.update = async (req, res) => {
    const client = await pool.connect();
    const { hasvalidated, hasarrivedsafely } = req.body;

    const shuttleid = parseInt(req.body.shuttleid);
    const partierid = parseInt(req.body.partierid);

    try {

        if (isNaN(shuttleid) || isNaN(partierid)) {
            res.sendStatus(400);
            return;
        }

        const { rows: shuttleMembers } = await ShuttleMemberModel.findOne(shuttleid, partierid, client);

        const shuttleMember = shuttleMembers[0];

        if (shuttleMember === undefined) {
            res.sendStatus(404);
            return;
        }

        const updatedHasValidated = hasvalidated !== undefined ? hasvalidated : shuttleMember.hasvalidated;
        const updatedHasArrivedSafely = hasarrivedsafely !== undefined ? hasarrivedsafely : shuttleMember.hasarrivedsafely;

        await ShuttleMemberModel.update(updatedHasValidated, updatedHasArrivedSafely, shuttleid, partierid, client);


        console.log(updatedHasValidated, updatedHasArrivedSafely, shuttleid, partierid);

        res.sendStatus(204);

    } catch (error) {

        console.error(error);
        res.sendStatus(500);

    } finally {
        client.release();
    }
} 

module.exports.signup = async (req, res) => {
    const client = await pool.connect();
    const { departuretime, destinationtown, destinationzipcode, eventid, oldshuttleid, partierid } = req.body;
    
    try {

        if (departuretime === undefined || destinationtown === undefined || destinationzipcode === undefined || partierid === undefined || eventid === undefined || oldshuttleid === undefined) {
            res.sendStatus(400);
            return;
        }

        if (isNaN(eventid) || isNaN(partierid || isNaN(oldshuttleid))) {
            res.sendStatus(400);
            return;
        }

        await client.query('BEGIN');

        if (oldshuttleid !== -1) {

            const { rows : shuttles} = await ShuttleModel.findOne(oldshuttleid, client);

            const shuttle = shuttles[0];

            if (shuttle === undefined) {
                res.sendStatus(404);
                return;
            }

            await ShuttleMemberModel.delete(shuttle.id, partierid, client);

            
            await ShuttleModel.deleteEmptyShuttle(shuttle.id, client);

        }

        const { rows : shuttles } = await ShuttleModel.findOneByDetails(departuretime, eventid, destinationtown, destinationzipcode, client);

        let shuttle = shuttles[0];

        if (shuttle === undefined) {

            const { rows : shuttles } = await ShuttleModel.create(departuretime, eventid, destinationtown, destinationzipcode, client);
            
            shuttle = shuttles[0];

            if (shuttle === undefined) {
                res.sendStatus(404);
                return;
            }
        } 

        const { rows : shuttleMembers } = await ShuttleMemberModel.create(false, false, shuttle.id, partierid, client);

        const shuttleMember = shuttleMembers[0];

        if (shuttleMember === undefined) {

            await client.query('ROLLBACK');

            res.sendStatus(404);
            return;
        }

        res.json(shuttleMember);
    } catch (error) {
        await client.query('ROLLBACK');
        console.error(error);
        res.sendStatus(500);
    } finally {

        await client.query('COMMIT');
        client.release();
    }
}

module.exports.cancel = async (req, res) => {
    const client = await pool.connect();

    const shuttleid = parseInt(req.params.shuttleid);
    const partierid = parseInt(req.params.partierid);
    
    try {

        if (isNaN(partierid) || isNaN(shuttleid)) {
            res.sendStatus(400);
            return;
        }

        const { rows : shuttleMembers } = await ShuttleMemberModel.findOne(shuttleid, partierid, client);

        const shuttleMember = shuttleMembers[0];

        if (shuttleMember === undefined) {
            res.sendStatus(404);
            return;
        }

        await ShuttleMemberModel.delete(shuttleid, partierid, client);

        await ShuttleModel.deleteEmptyShuttle(shuttleid, client);

        res.sendStatus(204);
    } catch (error) {
        console.error(error);
        res.sendStatus(500);
    } finally {
        client.release();
    }
}

module.exports.deleteAllByPartier = async (req, res) => {
    const client = await pool.connect();
    const partierid = parseInt(req.params.partierid);

    try {

        if (isNaN(partierid)) {
            res.sendStatus(400);
            return;
        }

        await ShuttleMemberModel.deleteAllByPartier(partierid, client);

        res.sendStatus(200);
    } catch (error) {
        console.error(error);
        res.sendStatus(500);
    } finally {
        client.release();
    }
}