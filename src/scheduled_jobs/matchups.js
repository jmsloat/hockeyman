import Yahoo from '#src/yahoo'
import _discord from '#src/discordClient'

let yahoo = Yahoo.getApi();
let discord = _discord.getClient();

let desc = '';
let games = await yahoo.getScoreboard();
let nWeek = games.week;
let matchups = [];
games.matchups.matchup.map( (matchup) => {
    let teams = matchup.teams;
    let away = teams.team[0];
    let home = teams.team[1];

    matchups.push(`${away.name} vs ${home.name}`);
});

await discord.sendEmbed(matchups, 'Week ' + nWeek, '877893650154127470');
