// honestly these are all integration tests anyway
import _discord from '#src/discordClient'
import chai from "chai";
import assert from "assert"

chai.should();

let discord = _discord.getClient();

describe('discord nonsense', async (done) => {
    async function callDone() {
        done()
    }
    beforeEach(() => {
        discord.on('ready', () => {
            callDone();
        });
    });

    it('channels can get messages', async () => {
        await discord.sendMessage('a test message from the thing');
    });
})
