// honestly these are all integration tests anyway
import _discord from '#src/discordClient'
import chai from "chai";
import assert from "assert"

chai.should();

let discord = _discord.getClient();

describe('discord nonsense', () => {
    before((done) => {
        discord.on('ready', () => {
            done();
        });
    });

    it('channels can get messages', async () => {
        await discord.sendMessage('a test message from the thing', 'robotland');
    });

    it('can tag a user', async () => {
        await discord.sendAndTag('a message to - ', 'sloat', 'robotland');
    });
})

