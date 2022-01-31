const schema = require("../../models/opt-out");
const schema_match = require("../../models/match");
module.exports = {
  name: "opt-out",
  description:
    "Opt-out of matching so neither you can match with someone nor can someone match with you",
  options: [
    {
      name: "toggle",
      description: "Set the toggle to true or false",
      type: 3,
      required: true,
      choices: [
        { name: "True", value: "true" },
        { name: "False", value: "false" },
      ],
    },
  ],
  async execute(client, interaction, Discord) {
    const toggle = interaction.options.getString("toggle");

    if (toggle == "true") {
      let data = await schema.findOne({ UserID: interaction.member.id });
      let matchData = await schema_match.findOne({ AuthorID: interaction.member.id });
if (matchData !== null) {
        interaction.reply({
          content: `You have already sent a match and can no longer opt-out of matching.`,
          ephemeral: true,
        });
} else if (data !== null) {
        interaction.reply({
          content: `You are already opted-out of matching.`,
          ephemeral: true,
        });
      } else if (data == null) {
        interaction
          .reply({
            content: `You have successfully opted-out of matching.`,
            ephemeral: true,
          })
          .then(() =>
            (data = new schema({
              UserID: interaction.user.id,
            })).save()
          );
      }
    }

    if (toggle == "false") {
      let data = await schema.findOne({ UserID: interaction.member.id });
      if (data !== null) {
        interaction
          .reply({
            content: `You have successfully opted-in to matching.`,
            ephemeral: true,
          })
          .then(() => data.remove());
      } else if (data == null) {
        interaction.reply({
          content: `You are already opted-in to matching.`,
          ephemeral: true,
        });
      }
    }
  },
};
