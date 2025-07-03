require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const { Client, GatewayIntentBits } = require('discord.js');
const axios = require('axios');

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent]
});

const app = express();
app.use(bodyParser.json());

client.once('ready', () => {
  console.log(`Logged in as ${client.user.tag}`);
});

app.post('/imagine', async (req, res) => {
  const { prompt } = req.body;
  try {
    const channel = await client.channels.fetch(process.env.CHANNEL_ID);
    await channel.send(`/imagine ${prompt}`);
    res.status(200).json({ message: 'Prompt sent to MidJourney' });
  } catch (err) {
    res.status(500).json({ error: 'Error sending prompt', details: err.message });
  }
});

client.login(process.env.DISCORD_BOT_TOKEN);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Proxy API listening on port ${PORT}`);
});