const Event = require('../../structures/Event')

module.exports = class extends Event {
    constructor(client) {
        super(client, {
            name: 'interactionCreate'
        })
    }
    run = async (interaction) => {
        if (interaction.isCommand()) {
            if (!interaction.guild) return;
            const cmd = this.client.commands.find(c => c.name === interaction.commandName)
            if (cmd) {

                cmd.run(interaction)
            }
        } else if (interaction.isButton()) {
            if (interaction.customId.startsWith('entrada')) {

                const sorteiosSchema = require('../../database/models/sorteios')

                const sorteiosData = await sorteiosSchema.findOne({ messageID: interaction.message.id })

                if (!sorteiosData) return;
                if (sorteiosData.reactedUsers.includes(interaction.member.id)) return interaction.reply({ content: 'Você já está no sorteio.', ephemeral: true })

                interaction.reply({ content: 'Você entrou no sorteio.', ephemeral: true })

                await sorteiosSchema.findOneAndUpdate({ messageID: interaction.message.id }, {
                    $addToSet: {
                        "reactedUsers": `${interaction.member.id}`
                    }
                })
            }
        }
    }
}