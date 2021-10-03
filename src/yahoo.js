import axios from "axios";
import qs from 'qs';
import * as config from '#src/config';
import * as parser from 'xml2json'
import urlcat from "urlcat";

export async function getLeagueSettings() {
    let url = urlcat.default('https://fantasysports.yahooapis.com/fantasy/v2/league/:league_key/settings', {league_key: leagueId});
    let response = await makeRequest(url);
    return response;
}

export async function auth() {
    let code = await getAccessTokens();
    if(code === '-1') return false;

    yahoo.access_code = code;

    return true;
}

export async function getGame(gameKey) {
    let url = urlcat.default('https://fantasysports.yahooapis.com/fantasy/v2/game/:game_key', {game_key: gameKey});
    let response = await makeRequest(url);
    return response;
}

export async function getGameKeys() {
    let url = urlcat.default('https://fantasysports.yahooapis.com/fantasy/v2/games;game_codes=nhl');
    let response = await makeRequest(url);

    if(response.fantasy_content){
        return response.fantasy_content.games.game;
    }

    return [];
}

export async function getPublicLeages(gameKey) {
    let url = urlcat.default('https://fantasysports.yahooapis.com/fantasy/v2/league/:league_key', {league_key: leagueId});
    let response = await makeRequest(url);
    return response;
}

export async function getTeams() {
    let url = urlcat.default('https://fantasysports.yahooapis.com/fantasy/v2/league/:league_key/teams', {league_key: leagueId});

    let response = await makeRequest(url);
    return response.fantasy_content.league.teams;
}

export async function getScoreboard() {
    let url = urlcat.default('https://fantasysports.yahooapis.com/fantasy/v2/league/:league_key/scoreboard', {league_key: leagueId});

    let response = await makeRequest(url);
    return response.fantasy_content.league.scoreboard;
}

let cfg = config.readConfig();
const consumerkey = cfg.yahoo.consumerKey;
const secret = cfg.yahoo.secret;
const authcode = cfg.yahoo.authCode;
let refreshToken = cfg.yahoo.refreshToken;
const leagueId = cfg.yahoo.gameKey + ".l." + cfg.yahoo.leagueId


let yahoo = {
    AUTH_ENDPOINT : 'https://api.login.yahoo.com/oauth2/get_token',
    FANTASY_ENDPOINT: `https://fantasysports.yahooapis.com/fantasy/v2`,
    AUTH_HEADER : Buffer.from(`${consumerkey}:${secret}`, 'binary').toString('base64'),
}

if(cfg.yahoo.accessToken === undefined || cfg.yahoo.accessToken === "" || cfg.yahoo.accessToken === null){
    await getAccessTokens();
}


async function refreshAuthToken() {
    let response =  await axios({
        url: yahoo.AUTH_ENDPOINT,
        method: "post",
        headers: {
            Authorization: `Basic ${yahoo.AUTH_HEADER}`,
            "Content-Type": "application/x-www-form-urlencoded",
            // "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/72.0.3626.109 Safari/537.36",
        },
        data: qs.stringify({
            redirect_uri: "oob",
            grant_type: "refresh_token",
            refresh_token: refreshToken,
        }),
    }).catch((err) => {
        console.error(`Error in refreshAuthorizationToken(): ${err}`);
    });

    let accessToken = response.data.access_token;
    let refresh = response.data.refresh_token;

    cfg.yahoo.refreshToken = refresh;
    cfg.yahoo.accessToken = accessToken;
    config.saveConfig(cfg);

    return response;
}

async function getAccessTokens(){
    let data = qs.stringify({
        client_id: consumerkey,
        client_secret: secret,
        redirect_uri: "oob",
        code: authcode,
        grant_type: "authorization_code",
    })
    let token = await axios({
        url: yahoo.AUTH_ENDPOINT,
        method: 'post',
        headers: {
            Authorization: `Basic ${yahoo.AUTH_HEADER}`,
            "Content-Type": "application/x-www-form-urlencoded",
            "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/72.0.3626.109 Safari/537.36",
        },
        data: data
    }).catch(async (err) => {
        console.error('error getting intial authorization: ' + err)
        console.log(data);
        if (err.response.data && err.response.data.error && err.response.data.error.description && err.response.data.error.description.includes("token_expired")) {
            const newToken = await refreshAuthToken(cfg.refreshToken);
            if (newToken && newToken.data && newToken.data.access_token) {
                return newToken.data.access_token;
            }
            else return "-1";
        }
        return "-1";
    });

    if(token && token.data && token.data.access_token){
        let accessToken = token.data.access_token;
        let refresh = token.data.refresh_token;
        cfg.yahoo.accessToken = accessToken;
        cfg.yahoo.refreshToken = refresh;

        config.saveConfig(cfg);

        return token.data.access_token;
    }
    else return "-1";
}

async function makeRequest(url){
    let response;
    try {
        response = await axios({
            url,
            method: "get",
            headers: {
                Authorization: `Bearer ${cfg.yahoo.accessToken}`,
                "Content-Type": "application/x-www-form-urlencoded",
            },
        });
        const jsonData = JSON.parse(parser.toJson(response.data, {}));
        return jsonData;
    } catch (err) {
        if (err.response.data && err.response.data.error && err.response.data.error.description && err.response.data.error.description.includes("token_expired")) {
            const newToken = await refreshAuthToken(cfg.yahoo.refreshToken);
            if (newToken && newToken.data && newToken.data.access_token) {

                cfg.yahoo.refreshToken = newToken.data.refresh_token;
                cfg.yahoo.accessToken = newToken.data.access_token;
                config.saveConfig(cfg);
                return makeRequest(url);
            }
        } else {
            console.error(`Error with credentials in makeAPIrequest()/refreshAuthorizationToken(): ${err}`);
        }
        return err;
    }
}



