const CronJob = require('cron').CronJob;
const ShuttleORM = require('../ORM/model/shuttle');
const ShuttleMemberORM = require('../ORM/model/shuttleMember');
const ShuttleMemberModel = require('../model/shuttleMember');
const ShuttleModel = require('../model/shuttle');

const pool = require('../model/database');


const { Op } = require('sequelize');

//Give me cron string for every second : 

module.exports.job = new CronJob('0/5 * * * * *', async function() {

    const client = await pool.connect();
    
    try {

        const now = new Date();

        const data = await ShuttleORM.findAll({
            include: [
                {
                    model: ShuttleMemberORM,
                }
            ]
        });
    
        const shuttles = data.map(shuttle => shuttle.toJSON());

        shuttles.forEach(shuttle => {
            const departureTime = new Date(shuttle.departuretime);

            shuttle.shuttlemembers.forEach(shuttleMember => {


                if (!shuttleMember.hasvalidated) {

                    if (now > new Date(departureTime.getTime() + 10 * 60000)) {
                        ShuttleMemberModel.delete(shuttleMember.shuttleid, shuttleMember.partierid, client);
                        ShuttleModel.deleteEmptyShuttle(shuttleMember.shuttleid, client);
                    } else if (now > new Date(departureTime.getTime() - 15 * 60000)) {
                        // Send first reminder
                    } else if (now > new Date(departureTime.getTime() - 5 * 60000)) {
                        // Send second reminder
                    }

                }
            });

        });
        
    } catch (error) {
        console.error(error);
    } finally {
        client.release();
    }

}, null, true, 'Europe/Paris');

