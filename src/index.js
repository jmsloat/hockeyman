import dotenv from 'dotenv';
dotenv.config();

import REST from '@discordjs/rest';

import { Routes } from 'discord-api-types/v9';
import {Client, Collection, Intents} from 'discord.js';

import fs from 'fs'

import Bree from 'bree'

const commands = [];
const commandFiles = fs.readdirSync('src/commands').filter(file => file.endsWith('js'));

const TOKEN = process.env.TOKEN;
const CLIENTID = process.env.CLIENTID;
const GUILDID = process.env.GUILDID;


const client = new Client({
    intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MESSAGE_REACTIONS]
});

client.commands = new Collection();


// register commands
for(const f of commandFiles) {

    const cmd = await import((`./commands/${f}`))
    client.commands.set(cmd.data.name, cmd)
    commands.push(cmd.data.toJSON())
}

const rest = new REST.REST({version: '9'}).setToken(TOKEN);


client.on('interactionCreate', async interaction => {
    if(!interaction.isCommand()) return;

    const cmd = client.commands.get(interaction.commandName);
    if(!cmd) return;

    await cmd.execute(interaction);
});


function initializeJobs() {
    let bree = new Bree({
        root: false,
        jobs: [
            {
                name: 'job man',
                path: './src/scheduled_jobs/fuck-you-kevin.js',
                interval: "20 seconds"
            }
        ]
    });

    bree.start();
}

client.once('ready', () => {
    console.log('Ready!');

    (async () => {
        try {
            console.log('refreshing slash commands...');

            await rest.put(
                Routes.applicationGuildCommands(CLIENTID, GUILDID),
                {body:commands}
            );

            console.log('successfully registered slash commands');
        }
        catch (e) {
            console.log(e)
        }
    })();

    client.user.setPresence({
        status: 'online',
        activity: {
            name: 'drinking',
            type: 'PLAYING',
            url: 'https://www.google.com'
        }
    });

    initializeJobs();
})

client.login(TOKEN);

