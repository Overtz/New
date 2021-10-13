const Command = require('../../structures/Command')

const { MessageEmbed } = require('discord.js')

module.exports = class extends Command {
    constructor(client) {
        super(client, {
            name: 'reiniciar',
            description: 'Reinicia um sorteio.',
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

        if (!sorteiosData) return interaction.reply({ content: 'ID mencionado não é de um sorteio existente.', ephemeral: true });
        if (!sorteiosData.status == 'ativo') return interaction.reply({ content: 'ID mencionado ainda está ativo.', ephemeral: true });

        const usersDB = sorteiosData.reactedUsers
        const channel = interaction.guild.channels.cache.get(sorteiosData.channelID);
        const message = await channel.messages.fetch(sorteiosData.messageID);

        if (usersDB.length <= 1) return interaction.reply({ content: 'Não há como resortear um sorteio que não atingiu os requisitos minímos.' });

        var rand = usersDB[Math.floor(Math.random() * usersDB.length)];
        const winner = interaction.guild.members.cache.get(rand);

        const finalizedEmbed = new MessageEmbed()
        .setTitle(`${sorteiosData.award}`)
        .setColor('#ff0000')
        .addField('Ganhador', `${winner}`)
        .addField('Hosteado por', `<@${sorteiosData.authorID}>`)
        .setFooter('1 Ganhador(es)')
        .setTimestamp()

        if (!sorteiosData.description == null) {
            finalizedEmbed.setDescription(`${sorteiosData.description}`)
        }

        await message.edit({ content: 'Sorteio Finalizado!', embeds: [finalizedEmbed], components: [] });
        await sorteiosSchema.findOneAndUpdate({ messageID: message.id }, {
            winnerID: winner.id,
            $pull: {
                reactedUsers: winner.id
            }
        })
        await interaction.reply({ content: `Sorteio reinicializado com sucesso, novo ganhador: <@${winner.id}>` });
    }
}