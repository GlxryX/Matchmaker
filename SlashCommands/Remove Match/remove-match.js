const schema = require("../../models/match");

module.exports = {
  name: "remove-match",
  description: "Remove a sent match",

  async execute(client, interaction, Discord) {
    let check = await schema.findOne({ AuthorID: interaction.member.id });
    if (check !== null) {
      let matchFound = await schema.findOne({ AuthorID: check.MatchID });
      if (matchFound) {
        return interaction.reply({
          content: `You are already matched with <@${matchFound.AuthorID}> and therefore can't remove your match.`,
          ephemeral: true,
        });
      } else {
        await schema.findOneAndDelete({ AuthorID: interaction.member.id }).then(() => {
          interaction.reply({
            content: `Your match has successfully been removed.`,
            ephemeral: true,
          });
        });
      }
    } else {
        return interaction.reply({
            content: `You currently have no requested match.`,
            ephemeral: true,
        });
    }
  },
};
