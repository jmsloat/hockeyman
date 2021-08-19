import assert from "assert"
import * as nhl from "#src/nhl"

describe('stats api', () => {
    describe('can get a playerid', () => {
        it('should be able to get crosby\'s id', async () => {
            let id = await nhl.getPlayerIdFromName("crosby");
            assert.strictEqual('8471675', id);
        });

        it('dont break if the player isnt real', async () => {
            let id = await nhl.getPlayerIdFromName("mr. magoo and sons")
            assert.strictEqual(id, -1)
        })
    })

    describe('can get the stats of a player', async () => {

        it('can get some stats', async () => {
            const id = await nhl.getPlayerIdFromName("crosby");
            let stats = await nhl.getPlayerStats(id, {})
        })

        it('can limit the years', async () => {
            const id = await nhl.getPlayerIdFromName("crosby");
            let stats = await nhl.getPlayerStats(id, {years:5})

            assert.strictEqual(stats.length, 5);
        })

        it('only get NHL games', async () => {
            const id = await nhl.getPlayerIdFromName("crosby");
            let stats = await nhl.getPlayerStats(id, {years:5})
            for(const s of stats) {
                assert.strictEqual(s['league']['id'], 133)
            }
        })
    })
})
