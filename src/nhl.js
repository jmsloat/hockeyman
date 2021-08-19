import urlcat from "urlcat";
import axios from "axios";

let url = urlcat.default;
const NHL_LEAGUE_ID = 133;

export async function getPlayerIdFromName(name) {
    let suggestionUrl = url('https://suggest.svc.nhl.com/svc/suggest/v1/minplayers/:name/:count',{
        name: name,
        count: 10
    });

    let result = await axios.get(suggestionUrl)
    if(result.data['suggestions'].length < 1) return -1;

    let player = result.data['suggestions'][0]
    let parts = player.split('|');

    return parts[0];
}

export async function getPlayerStats(id, options) {

    let seasons = -1;
    if(options.years !== null && options.years > 0)
    {
        seasons = options.years;
    }
    let statsUrl = url(`https://statsapi.web.nhl.com/api/v1/people/:id/stats`, {
        id: id,
        stats: "yearByYear",
    })

    let result = await axios.get(statsUrl);
    let splits = result.data['stats'][0]['splits'];

    //only keep NHL stuff
    splits = splits.filter(s => s.league.id === NHL_LEAGUE_ID)

    if(options.years !== undefined && options.years > 0){
        return splits.slice(splits.length-seasons, splits.length+1)
    }
    else return splits;
}



