const cron = require('node-cron');
module.exports = () => {
    cron.schedule('* * * * *', () => {
        console.log(`Running crawling new posts at: ${new Date()}`);
    });
}