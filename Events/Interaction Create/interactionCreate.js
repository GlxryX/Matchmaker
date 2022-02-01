const Discord = require("discord.js");
const client = require("../../index.js");

client.on("interactionCreate", async (interaction) => {
  if (interaction.isCommand()) {
    const cmd = client.slashCommands.get(interaction.commandName);
    if (!cmd)
      return interaction.reply({
        content: "An Error Has Occered In Slash Command",
      });

    const guild = client.guilds.cache.get(interaction.guildId);
    const args = [];

    for (let option of interaction.options.data) {
      if (option.type === "SUB_COMMAND") {
        if (option.name) args.push(option.name);
        option.options?.forEach((x) => {
          if (x.value) args.push(x.value);
        });
      } else if (option.value) args.push(option.value);
    }

    if (
      interaction.channel == null // If the interaction is in a DM
    ) {
        return interaction.reply({ content: "This command cannot be used in a Direct Message", ephemeral: true });
    } else {
      interaction.member = interaction.guild.members.cache.get(
        interaction.user.id
      );
      if (!interaction.guild.me.permissions.has(["EMBED_LINKS"])) {
        return interaction.reply(
          "I lack the required permission to send embeds needed for core functionality."
        );
      } else {
        cmd.execute(client, interaction, Discord);
      }
    }
  }
});
