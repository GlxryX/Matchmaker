const schema = require("../../models/match");
const schema_opt = require("../../models/opt-out");
module.exports = {
  name: "match",
  description: "WARNING: THIS CHOICE IS IRREVERSIBLE",
  options: [
    {
      name: "user",
      description: "The user you want to match with",
      type: 6,
      required: true,
    },
  ],
  async execute(client, interaction, Discord) {
    const user = interaction.options.getUser("user");

    if (interaction.member.id === user.id) {
      return interaction.reply({
        content: "You can't match with yourself.",
        ephemeral: true,
      });
    }
    let opt = await schema_opt.findOne({ UserID: user.id });
    if (opt !== null || user.bot) {
      return interaction.reply({
        content: `That user is not currently available to match with.`,
        ephemeral: true,
      });
    }

    let optUser = await schema_opt.findOne({ UserID: interaction.member.id });
    if (optUser !== null) {
      return interaction.reply({
        content: `You have currently disabled matching. Please enable it before matching using \`/opt-out false\`.`,
        ephemeral: true,
      });
    }

    let check = await schema.findOne({ AuthorID: interaction.member.id });
    if (check) {
      let matchFound = await schema.findOne({ AuthorID: check.MatchID });
      if (matchFound) {
        return interaction.reply({
          content: `You are already matched with <@${matchFound.AuthorID}>.`,
          ephemeral: true,
        });
      } else {
        return interaction.reply({
          content: `You have already entered a desired match.`,
          ephemeral: true,
        });
      }
    } else {
      let data = await schema.findOne({ MatchID: interaction.member.id });
      if (data !== null && data.AuthorID == user.id) {
        interaction.reply({
          content: `You have been matched with <@${data.AuthorID}>.`,
          ephemeral: true,
        }) &&
          interaction.user
            .send(`You have been matched with <@${data.AuthorID}>.`)
            .catch(() =>
              interaction.followUp({
                content: `An error occured trying to send you a message of your match, <@${user.id}>.`,
                ephemeral: true,
              })
            ) &&
          interaction.guild.members.cache
            .get(data.AuthorID)
            .send(`You have been matched with <@${interaction.user.id}>.`)
            .catch(() =>
              interaction.followUp({
                content: `An error occured trying to send a message to your match, <@${user.id}>.`,
                ephemeral: true,
              })
            )
            .then(() =>
              (data = new schema({
                AuthorID: interaction.user.id,
                MatchID: user.id,
              })).save()
            );
      } else {
        data = new schema({
          AuthorID: interaction.user.id,
          MatchID: user.id,
        });
        await data.save();
        return interaction.reply({
          content: "Your match has successfully been sent.",
          ephemeral: true,
        });
      }
    }
  },
};
