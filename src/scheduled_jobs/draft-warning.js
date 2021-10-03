import Yahoo from '#src/yahoo'
import _discord from '#src/discordClient'

function getNumDaysBetween(draftDay, nowDay) {

    const oneDayMillis = 1000 * 60 * 60 * 24;
    const diffTime = draftDay.getTime() - nowDay.getTime();

    return Math.round(diffTime / oneDayMillis);
}

let api = Yahoo.getApi();
let discord = _discord.getClient();

let league = await api.getLeagueSettings();

let draftTime = parseInt(league.settings.draft_time);
let d = new Date(draftTime * 1000);
let now = new Date(Date.now());

let numDays = getNumDaysBetween(d, now);

function formatDate(d) {
    return d.toLocaleDateString("en-US", {weekday: "long", month: "long"})
}

if(numDays > 0) {
    let message = 'Your draft will be in ' + numDays + ' days.';
    message += '\nIt is currently scheduled for ' + formatDate(d);
    await discord.sendMessage(message)
}

