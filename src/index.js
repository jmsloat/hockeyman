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
                interval: "20 seconds"
            },
            {
                name: 'draft_warning',
                path: './src/scheduled_jobs/draft-warning.js',
                interval: "30s"
            }
        ]
    });

    bree.start();
}

client.on('ready', () => {

    initializeJobs();
})
