const pool = require('../model/database');
const ShuttleMemberModel = require('../model/shuttleMember');
const ShuttleModel = require('../model/shuttle');

module.exports.getShuttleMember = async (req, res) => {
    const client = await pool.connect();
    const id = req.params.id;

    try {

        if (isNaN(id)) {
            res.sendStatus(400);
            return;
        }
        
        const {rows: shuttleMembers} = await ShuttleMemberModel.getShuttleMember(id, client);

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

module.exports.getAllShuttleMembers = async (req, res) => {
    const client = await pool.connect();

    try {
        const {rows: shuttleMembers} = await ShuttleMemberModel.getAllShuttleMembers(client);

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

module.exports.updateShuttleMember = async (req, res) => {
    const client = await pool.connect();
    const { hasvalidated, hasarrivedsafely } = req.body;

    const shuttleid = parseInt(req.body.shuttleid);
    const partierid = parseInt(req.body.partierid);

    try {

        if (isNaN(shuttleid) || isNaN(partierid)) {
            res.sendStatus(400);
            return;
        }

        const { rows: shuttleMembers } = await ShuttleMemberModel.getShuttleMember(shuttleid, partierid, client);

        const shuttleMember = shuttleMembers[0];

        if (shuttleMember === undefined) {
            res.sendStatus(404);
            return;
        }

        const updateShuttleMemberdHasValidated = hasvalidated !== undefined ? hasvalidated : shuttleMember.hasvalidated;
        const updateShuttleMemberdHasArrivedSafely = hasarrivedsafely !== undefined ? hasarrivedsafely : shuttleMember.hasarrivedsafely;

        await ShuttleMemberModel.updateShuttleMember(updateShuttleMemberdHasValidated, updateShuttleMemberdHasArrivedSafely, shuttleid, partierid, client);


        console.log(updateShuttleMemberdHasValidated, updateShuttleMemberdHasArrivedSafely, shuttleid, partierid);

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

            const { rows : shuttles} = await ShuttleModel.getShuttle(oldshuttleid, client);

            const shuttle = shuttles[0];

            if (shuttle === undefined) {
                res.sendStatus(404);
                return;
            }

            await ShuttleMemberModel.deleteShuttleMember(shuttle.id, partierid, client);

            await ShuttleModel.deleteEmptyShuttle(shuttle.id, client);

        }

        const { rows : shuttles } = await ShuttleModel.getShuttleByDetails(departuretime, eventid, destinationtown, destinationzipcode, client);

        let shuttle = shuttles[0];

        if (shuttle === undefined) {
            const { rows : newShuttle } = await ShuttleModel.postShuttle(departuretime, eventid, destinationtown, destinationzipcode, client);
            shuttle = newShuttle[0];
        } 
        
        await ShuttleMemberModel.postShuttleMember(false, false, shuttle.id, partierid, client);

        res.sendStatus(201);

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

        const { rows : shuttleMembers } = await ShuttleMemberModel.getShuttleMember(shuttleid, partierid, client);

        const shuttleMember = shuttleMembers[0];

        if (shuttleMember === undefined) {
            res.sendStatus(404);
            return;
        }

        await ShuttleMemberModel.deleteShuttleMember(shuttleid, partierid, client);

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