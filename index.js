const Discord = require("discord.js");
const { Client, Collection } = require("discord.js");
const mongoose = require("mongoose");
require("dotenv").config();

const client = new Client({
  intents: [
    Discord.Intents.FLAGS.GUILDS,
    Discord.Intents.FLAGS.GUILD_BANS,
    Discord.Intents.FLAGS.GUILD_EMOJIS_AND_STICKERS,
    Discord.Intents.FLAGS.GUILD_INTEGRATIONS,
    Discord.Intents.FLAGS.GUILD_WEBHOOKS,
    Discord.Intents.FLAGS.GUILD_INVITES,
    Discord.Intents.FLAGS.GUILD_VOICE_STATES,
    Discord.Intents.FLAGS.GUILD_PRESENCES,
    Discord.Intents.FLAGS.GUILD_MESSAGES,
    Discord.Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
    Discord.Intents.FLAGS.GUILD_MESSAGE_TYPING,
    Discord.Intents.FLAGS.DIRECT_MESSAGES,
    Discord.Intents.FLAGS.DIRECT_MESSAGE_REACTIONS,
    Discord.Intents.FLAGS.DIRECT_MESSAGE_TYPING,
  ],
});

const fs = require("fs");

client.events = new Collection();
client.slashCommands = new Collection();

module.exports = client;

["Event", "Slash"].forEach((handler) => {
  require(`./Structures/${handler}`)(client);
});


client.once("ready", () => {
  let initmsg = `${client.user.username} Initialized.`;
  console.log(initmsg);
  let serverIn = client.guilds.cache.size;
    client.user.setActivity(`with your feelings`, {
      type: "PLAYING",
    });
});

process.on("unhandledRejection", (err) => {
  console.log(`[ERROR] Unhandled promise rejection: ${err.message}.`);
  console.log(err);
});

// mongoose connection
mongoose
  .connect(process.env.MONGODB_SRV, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.log(err);
  });

client.login(process.env.MATCHMAKER_TOKEN);
