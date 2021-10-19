import Yahoo from '#src/yahoo'
import _discord from '#src/discordClient'

let yahoo = Yahoo.getApi();
let discord = _discord.getClient();

let desc = '';
let request = await yahoo.getStandings();
let standings = [];

request.teams.team.map( (team) => {
    let wins = team.team_standings.outcome_totals.wins;
    let losses = team.team_standings.outcome_totals.losses;
    let ties = team.team_standings.outcome_totals.ties;

    standings.push(`${team.name}    ${wins} - ${losses} - ${ties}`);
});


await discord.sendEmbed(standings, 'Standings');
