const schema = require("../../models/match");
const schema_opt = require("../../models/opt-out");
module.exports = {
  name: "match",
  description: "Speciy the user you want to match with",
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

    // Check if user is opted-in
    let optUser = await schema_opt.findOne({ UserID: interaction.member.id });
    if (optUser !== null) {
      return interaction.reply({
        content: `You have currently disabled matching. Please enable it before matching using \`/opt-out false\`.`,
        ephemeral: true,
      });
    }

    // Database connections
    let check = await schema.findOne({ AuthorID: interaction.member.id });
    let data = await schema.findOne({ MatchID: interaction.member.id });

    // Check user's match status
    if (check !== null && data !== null && data.AuthorID == check.MatchID || check !== null && data == null) {
      if (check.MatchID !== user.id) {
        let matchFound = await schema.findOne({ AuthorID: check.MatchID });
        if (matchFound) {
          return interaction.reply({
            content: `You are already matched with <@${matchFound.AuthorID}>.`,
            ephemeral: true,
          });
        } else if (
          (data == null && check.MatchID !== user.id) ||
          (data !== null &&
            data.AuthorID !== user.id &&
            check.MatchID !== user.id)
        ) {
          return interaction
            .reply({
              content: `Your match has successfully been updated from <@${check.MatchID}> to <@${user.id}>.`,
              ephemeral: true,
            })
            .then(() =>
              schema.updateOne(
                { AuthorID: interaction.member.id },
                {
                  $set: { MatchID: user.id },
                }
              )
            );
        }
      } else if (check.MatchID == user.id) {
        return interaction.reply({
          content: `You have already submitted a match for <@${user.id}>.`,
          ephemeral: true,
        });
      }
    } else {
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
            .then(() => {
              if (check == null) {
                (data = new schema({
                  AuthorID: interaction.user.id,
                  MatchID: user.id,
                })).save();
              } else {
                schema.updateOne(
                  { AuthorID: interaction.member.id },
                  {
                    $set: { MatchID: user.id },
                  }
                );
              }
            });
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
