require('dotenv').config()
const Client = require('./src/structures/Client')

const express = require('express');
const app = express();
app.get("/", (request, response) => {
  const ping = new Date();
  ping.setHours(ping.getHours() - 3);
  console.log(`Ping recebido às ${ping.getUTCHours()}:${ping.getUTCMinutes()}:${ping.getUTCSeconds()}`);
  response.sendStatus(200);
})
app.listen(process.env.PORT);

const client = new Client({
  intents: [
      'GUILDS',
      'GUILD_MESSAGE_REACTIONS',
      'GUILD_MESSAGES',
      'GUILD_INVITES',
      'GUILD_VOICE_STATES',
      'GUILD_MEMBERS',
      'GUILD_PRESENCES',
      'GUILD_EMOJIS_AND_STICKERS',
      'DIRECT_MESSAGE_REACTIONS',
      'DIRECT_MESSAGE_TYPING',
      'DIRECT_MESSAGES',
  ]
})

client.login(process.env.TOKEN)