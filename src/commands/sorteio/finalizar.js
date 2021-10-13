const Command = require('../../structures/Command')

const { MessageEmbed } = require('discord.js')

module.exports = class extends Command {
    constructor(client) {
        super(client, {
            name: 'finalizar',
            description: 'Finaliza um sorteio.',
            options: [
                {
                    name: 'message_id',
                    description: 'ID da mensagem do sorteio.',
                    type: 'STRING',
                    required: true
                }
            ]
        })
    }

    run = async (interaction) => {

        const sorteiosSchema = require('../../database/models/sorteios');
        const messageID = interaction.options.getString('message_id');
        const sorteiosData = await sorteiosSchema.findOne({ messageID: messageID });

        if (!sorteiosData) return interaction.reply({ content: 'ID mencionado não é de um sorteio ativo.', ephemeral: true });
        if (sorteiosData.status == 'finalizado') return interaction.reply({ content: 'ID mencionado não é de um sorteio ativo.', ephemeral: true });


        const usersDB = sorteiosData.reactedUsers
        const channel = interaction.guild.channels.cache.get(sorteiosData.channelID);
        const message = await channel.messages.fetch(sorteiosData.messageID);

        if (usersDB.length <= 1) {

            const finalizedByNoReactedMin = new MessageEmbed()
                .setColor('#ff0000')
                .setTitle(`${sorteiosData.award}`)
                .addField('Ganhador', 'Nenhum.')
                .addField(`Hosteado por`, `<@${sorteiosData.authorID}>`)
                .setFooter('Sorteio finalizado por comando.')
                .setTimestamp()

            if (!sorteiosData.description == null) {
                finalizedByNoReactedMin.setDescription(`${sorteiosData.description}`)
            }

            await message.edit({ content: 'Sorteio finalizado!', embeds: [finalizedByNoReactedMin], components: [] });
            await sorteiosSchema.findOneAndUpdate({ messageID: messageID }, {
                status: 'finalizado'
            });
        } else {

            var rand = usersDB[Math.floor(Math.random() * usersDB.length)];

            const winner = interaction.guild.members.cache.get(rand);

            const finalizedEmbed = new MessageEmbed()
                .setColor('#ff0000')
                .setTitle(`${sorteiosData.award}`)
                .addField('Ganhador', `${winner}`)
                .addField('Hosteado por', `<@${sorteiosData.authorID}>`)
                .setFooter('Sorteio finalizado por comando.')
                .setTimestamp()

            if (!sorteiosData.description == null) {
                finalizedEmbed.setDescription(`${sorteiosData.description}`)
            }

            await message.edit({ content: 'Sorteio finalizado!', embeds: [finalizedEmbed], components: [] });
            await sorteiosSchema.findOneAndUpdate({ messageID: messageID }, {
                status: 'finalizado',
                winnerID: winner.id,
                $pull: {
                    reactedUsers: winner.id
                }
            });
        }

        await interaction.reply({ content: 'Sorteio finalizado com sucesso!', ephemeral: true });
    }
}