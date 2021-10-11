import * as chai from "chai";
import Yahoo from '#src/yahoo'
import {should} from "chai";

let yf = Yahoo.getApi();

chai.should();

describe('yahoo fantasy api', () => {

    describe('games', () => {
        it('can get some games', async () => {
            let game = await yf.getGame(303);
            game.should.not.be.undefined;
        });

        it('can get game keys', async () => {
            let keys = await yf.getGameKeys();
            keys.length.should.be.gte(22);
        })

        it('can get the nhl 2021 game key', async () => {
            let keys = await yf.getGameKeys();
            let found = false;
            let key = '';
            for(let k of keys) {
                if(k.season === '2021'){
                    found = true;
                    key = k.game_key;
                }
            }
            if(!found)
                should.fail();
        });
    })

    describe('leagues', () => {
        it('can get public leagues', async () => {
            let leagues = yf.getPublicLeages(403);
            // leages.length.should.be.gte(0);
            leagues.should.not.be.undefined
        });
    })

    describe('teams', () => {
        it('can get some teams', async () => {
            let teams = await yf.getTeams();

            if(teams === undefined) should.fail();
        })

        it('can get a scoreboard', async () => {
            let scoreboard = await yf.getScoreboard();

            if(scoreboard === undefined) should.fail();
        })

        it('can get settings', async () => {
            let scoreboard = await yf.getLeagueSettings();

            if(scoreboard === undefined) should.fail();
        })
    })

    describe('matchups', () => {
        it('can get matchups', async () => {
            let scoreboard = await yf.getMatchups();
        });
    })


})
