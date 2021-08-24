import * as chai from "chai";
import * as yf from '#src/yahoo'

chai.should();

describe('yahoo fantasy api', () => {
    describe('authentication', () => {
        it('can authenticate', async () => {
            let success = await yf.auth();
            success.should.not.be.a('boolean')
        })
    });

    describe('games', () => {
        it('can get some games', async () => {
            let teams = yf.getGame();
            teams.should.not.be.undefined;
        });
    })

    describe('teams', () => {
        it('can get some teams', async () => {
            // let teams = yf.getGame();
        });
    })

})
