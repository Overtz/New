const Command = require('../../structures/Command')

const { MessageEmbed, MessageButton, MessageActionRow } = require('discord.js')

module.exports = class extends Command {
    constructor(client) {
        super(client, {
            name: 'iniciar',
            description: 'Inicia um sorteio.',
            options: [
                {
                    name: 'premio',
                    description: 'Prêmio a ser entregue.',
                    type: 'STRING',
                    required: true
                },
                {
                    name: 'tempo',
                    description: 'Tempo que o sorteio terá.',
                    type: 'STRING',
                    required: true
                },
                {
                    name: 'descricao',
                    description: 'Descrição do sorteio.',
                    type: 'STRING',
                    required: false
                },
                {
                    name: 'canal',
                    description: 'Canal que será realizado o sorteio.',
                    type: 'CHANNEL',
                    required: false
                }
            ]
        })
    }

    run = async (interaction) => {

        const sorteioSchema = require('../../database/models/sorteios')
        const ms = require('ms')

        if (!interaction.member.permissions.has('ADMNINSTRATOR')) return interaction.reply({ content: 'Você não tem permissão para executar este comando!', ephemeral: true });
        
        const channel = interaction.options.getChannel('canal');
        const tempo = interaction.options.getString('tempo');
        const award = interaction.options.getString('premio');
        const description = interaction.options.getString('descricao');

        if (!tempo) return interaction.reply({ content: 'Adicione um tempo para sortear.', ephemeral: true });
        if (!award) return interaction.reply({ content: 'Adicione um prêmio para sortear.', ephemeral: true });

        const button = new MessageActionRow()
        .addComponents(
          new MessageButton()
            .setCustomId('entrada')
            .setLabel('Entrar')
            .setEmoji('🎉')
            .setStyle('SUCCESS'),
        );

        const sorteioEmbed = new MessageEmbed()
        .setTitle(`${award}`)
        .setColor('#00a000')
        .addField(`Tempo`, `${tempo}`, true)
        .addField(`Hosteado por`, `${interaction.member}`, true)
        .setFooter('1 Ganhador(es) | Termina em')
        .setTimestamp(ms(tempo) + Date.now())

        if (description) {
            sorteioEmbed.setDescription(`${description}`)
        }

        var message;

        if (channel) {
            message = await channel.send({ embeds: [sorteioEmbed], components: [button] })
            await interaction.reply({ content: 'Sorteio enviado com sucesso!', ephemeral: true })
        } else {
            message = await interaction.channel.send({ embeds: [sorteioEmbed], components: [button] })
            await interaction.reply({ content: 'Sorteio enviado com sucesso!', ephemeral: true })
        }

        await sorteioSchema.create({
            serverID: interaction.guild.id,
            authorID: interaction.member.id,
            award: award,
            description: description,
            channelID: interaction.channel.id,
            time: ms(tempo) + Date.now(),
            messageID: message.id,
            status: 'ativo'
        })
    }
}