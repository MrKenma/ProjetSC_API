const CronJob = require('cron').CronJob;
const ShuttleORM = require('../ORM/model/shuttle');
const ShuttleMemberORM = require('../ORM/model/shuttleMember');
const { Op } = require('sequelize');

//Give me cron string for every second : 

module.exports.job = new CronJob('0/5 * * * * *', async function() {
    
    try {

        const now = new Date();

        console.log(now);

        const data = await ShuttleORM.findAll({
            include: [
                {
                    model: ShuttleMemberORM,
                }
            ],
            where: {
                departuretime: {
                    [Op.gte]: new Date(),
                } 
            }
        });
    
        const shuttles = data.map(shuttle => shuttle.toJSON());

        shuttles.forEach(shuttle => {
            const departureTime = new Date(shuttle.departuretime);

            shuttle.shuttlemembers.forEach(shuttleMember => {
                console.log(shuttleMember);
            });

        });

        
    } catch (error) {
        console.error(error);
    }

}, null, true, 'Europe/Paris');

