require('dotenv').config();
const { Client, GatewayIntentBits, Events } = require('discord.js');
const axios = require('axios');

const client = new Client({
  intents: [GatewayIntentBits.Guilds]
});

client.once(Events.ClientReady, () => {
  console.log(`✅ Logged in as ${client.user.tag}`);
});

client.on(Events.InteractionCreate, async interaction => {
  if (!interaction.isChatInputCommand()) return;
  if (interaction.commandName !== 'imagine') return;

  const prompt = interaction.options.getString('prompt');

  // Reply so Discord doesn't time out
  await interaction.reply({
    content: `🧠 Sending your prompt: "${prompt}" to MidJourney...`,
    ephemeral: true
  });

  try {
    const response = await axios.post(`${process.env.MJ_PROXY_URL}/imagine`, {
      prompt,
      ref: interaction.user.username,
      webhookOverride: process.env.N8N_WEBHOOK_URL || null
    });

    console.log('✅ MJ Proxy accepted:', response.data);
  } catch (err) {
    console.error('❌ MJ Proxy error:', err.message);
    await interaction.followUp({
      content: `❌ Failed to send prompt: ${err.message}`,
      ephemeral: true
    });
  }
});

client.login(process.env.DISCORD_BOT_TOKEN);
