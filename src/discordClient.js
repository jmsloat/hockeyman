import fs from "fs";
import {Client, Collection, Intents, MessageEmbed} from "discord.js";
import REST from "@discordjs/rest";
import {EventEmitter} from 'events';

import {readConfig} from '#src/config'

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

        (async () => {
            await this.#registerCommands();
        })();

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
                   await message.reply(`fuck kevin`);
           }
        });


        this.rest = new REST.REST({version: '9'}).setToken(this.TOKEN);
        this.client.login(this.TOKEN)
    }

    async sendMessage(message, channelName = undefined) {
        if(channelName === undefined)
            channelName = this.channel.name;
        else{
            let channel = await this.#getChannel(channelName)
            await channel.send(message);
        }
    }

    async #getChannel(channelName) {
        let guild = await this.client.guilds.fetch(cfg.discord.guildId);
        return guild.channels.fetch(channelName);
    }

    async sendAndTag(message, userName, channelName = undefined){
        if(channelName === undefined) {
            channelName = this.channel.name;
        }

        let channel = this.#getChannel(channelName);
        await channel.send(`${await this.#getUserByName('sloat')} - I can ping you`)
    }

    async sendEmbed(fields, title, channelName = undefined) {
        const embed = new MessageEmbed()
            .setColor('#0099ff')
            .setTitle(title)
            .setFooter('fuck off nerds')
        ;

        fields.map( (thing) => {
            embed.addField('game', thing)
        });

        if(channelName === undefined)
            channelName = this.channel.name;

        let channel = await this.#getChannel(channelName);
        await channel.send({embeds : [embed]});
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

    async #getAllUsers() {
        let guild = await this.client.guilds.cache.get(cfg.discord.guildId);
        return await guild.members.fetch();
    }

    async #getUserByName(name) {
        let users = await this.#getAllUsers();
        return users.find(x => x.name === name);
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


