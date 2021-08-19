import {SlashCommandBuilder, SlashCommandStringOption, SlashCommandIntegerOption} from "@discordjs/builders";
import * as nhl from "../nhl.js";
import AsciiTable from 'ascii-table'

let nameOption =
    new SlashCommandStringOption()
        .setName('name')
        .setDescription('Player\'s Name')
        .setRequired(true);

let yearsOption =
    new SlashCommandIntegerOption()
        .setName('years')
        .setDescription('How many seasons back of stats to get')
        .setRequired(false);

export const data = new SlashCommandBuilder()
    .setName('stats')
    .setDescription('get a players stats')
    .addStringOption(nameOption)
    .addIntegerOption(yearsOption) ;


function formatStatsInfo(statLine) {
    if(statLine['league']['id'] !== 133) return [];

    let season = statLine['season'].substring(0, 4) + "-" + statLine['season'].substring(4,8);
    let goals = statLine['stat']['goals'];
    let assists = statLine['stat']['assists'];

    return [season, goals, assists];
}

export async function execute(interaction) {

    let playerName = interaction.options.getString(nameOption.name);
    let id = await nhl.getPlayerIdFromName(playerName);
    let years = interaction.options.getInteger(yearsOption.name);

    if(id === -1){
        interaction.reply('couldn\'t find that player');
    }
    let stats = await nhl.getPlayerStats(id, {years: years});
    if(years !== null) {
        let years = stats.length;
        stats = stats.slice(stats.length - years-1, stats.length)
    }
    let t = new AsciiTable(playerName)
    t.setHeading('Season', 'G', 'A');
    let s = "```";
    for (const stat of stats) {
        let formatted = formatStatsInfo(stat);
        if(formatted.length > 0)
            t.addRow(formatted);
    }
    s += t.toString()
    s += '```'

    interaction.reply(s);
}



