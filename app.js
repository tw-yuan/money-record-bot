const { token, GAS_LINK, bot_id } = require('./config.json');
const { Client, GatewayIntentBits } = require('discord.js');
const axios = require('axios');
const { readFileSync } = require('fs');
const client = new Client({
    intents: [
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,]
});

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

client.on("messageCreate", (message) => {
    if (message.author.id != bot_id) {
        const data = readFileSync('./config.json');
        const allow_channels = JSON.parse(data).allow_channels;
        if (allow_channels.indexOf(message.channelId) !== -1) {
            async function getResponse(record) {
                const record_arr = record.split(/\s+/);
                axios.get(GAS_LINK, {
                    params: {
                        data: record_arr[0],
                        reason: record_arr[1],
                        amount: record_arr[2],
                        method: "write"
                    }
                })
                    .catch((error) => console.log(error))
                console.log(`${record}`);
                message.reply(`${record_arr[0]} ${record_arr[1]} ${record_arr[2]} 記帳完成。`);
            }
            getResponse(message.content);
        }
    }
});
process.on('uncaughtException', function (err) {
    console.log('Caught exception: ' + err);
});
process.on("unhandledRejection", function (err) {
    console.log(err)
});

client.login(token);