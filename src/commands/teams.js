import {SlashCommandBuilder} from "@discordjs/builders";
import axios from 'axios';


export const data = new SlashCommandBuilder()
        .setName('teams')
        .setDescription('get some teams');

export async function execute(interaction) {
    let result = await axios.get('https://statsapi.web.nhl.com/api/v1/teams')
    let listOfTeams = result.data.teams.map(x => x.name).join(',');
    interaction.reply(listOfTeams);
}
