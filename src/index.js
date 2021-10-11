import discord from '#src/discordClient'
import Bree from 'bree'

let client = discord.getClient();

function initializeJobs() {
    let bree = new Bree({
        root: false,
        jobs: [
            {
                name: 'job man',
                path: './src/scheduled_jobs/fuck-you-kevin.js',
                interval: "30 seconds"
            },
            {
                name: 'draft_warning',
                path: './src/scheduled_jobs/draft-warning.js',
                interval: "at 7:00pm est"
            },
            {
                name: 'matchups',
                path: './src/scheduled_jobs/matchups.js',
                interval: 'at 8:00 am est every monday'
            }
        ]
    });

    bree.start();
}

client.on('ready', () => {

    initializeJobs();
})
