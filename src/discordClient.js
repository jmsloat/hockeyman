import fs from "fs";
import {Client, Collection, Intents} from "discord.js";
import REST from "@discordjs/rest";
import {EventEmitter} from 'events';

import {saveConfig, readConfig} from '#src/config'

let cfg = readConfig();

export default {
    getClient : () => {return myClient}
}

class _DiscordClient extends EventEmitter {

    commands = [];
    commandFiles = fs.readdirSync('src/commands').filter(file => file.endsWith('js'));

    TOKEN = cfg.discord.token;
    CLIENTID = cfg.discord.clientId;
    GUILDID = cfg.discord.guildId;


    constructor() {
        super();

        this.client = new Client({
            intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MESSAGE_REACTIONS]
        });

        this.client.commands = new Collection();

        this.#registerCommands();

        this.client.on('interactionCreate', async interaction => {
            if(!interaction.isCommand()) return;

            const cmd = this.client.commands.get(interaction.commandName);
            if(!cmd) return;

            await cmd.execute(interaction);
        });

       this.client.once('ready', () => {
           let guild = this.client.guilds.cache.get(this.GUILDID);
           this.channel = guild.channels.cache.find(e => e.name === 'general');

           this.#onDiscordReady()
       });

       this.client.on('message', async (message) => {
           if(message.author.id === this.client.user.id) return false;

           if(message.mentions.has(this.client.user)){
               if(message.author.username === 'Coyne')
                   await message.reply("fuck you")
               else
                   await message.reply('fuck kevin');
           }
        })

        this.rest = new REST.REST({version: '9'}).setToken(this.TOKEN);
        this.client.login(this.TOKEN)
    }

    async sendMessage(message) {
        this.channel.send(message);
    }

    // private methods? javascript can do this?
    async #registerCommands() {
        // register commands
        for(const f of this.commandFiles) {

            const cmd = await import((`./commands/${f}`))
            this.client.commands.set(cmd.data.name, cmd)
            this.commands.push(cmd.data.toJSON())
        }
    }

    #onDiscordReady() {
        console.log('Ready!');

        (async () => {
            try {
                console.log('refreshing slash commands...');

                // await this.rest.put(
                //     Routes.applicationGuildCommands(this.CLIENTID, this.GUILDID),
                //     {body:this.commands}
                // );

                console.log('successfully registered slash commands');
            }
            catch (e) {
                console.log(e)
            }
        })();

        this.client.user.setPresence({
            status: 'online',
            activity: {
                name: 'drinking',
                type: 'PLAYING',
                url: 'https://www.google.com'
            }
        });

        this.emit('ready');
    }

}
let myClient = new _DiscordClient();


