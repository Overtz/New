const Event = require('../../structures/Event')

const sorteiosSchema = require('../../database/models/sorteios')
const { MessageEmbed } = require('discord.js')

module.exports = class extends Event {
    constructor(client) {
        super(client, {
            name: 'ready'
        })
    }

    run = async () => {

        setInterval(async () => {

            try {

                const guild = this.client.guilds.cache.get('836291214847901796')

                const sorteiosData = await sorteiosSchema.findOne({ serverID: guild.id });
                if (!sorteiosData) return;

                if (sorteiosData.status == 'finalizado') return;

                const channel = guild.channels.cache.get(sorteiosData.channelID)
                const message = await channel.messages.fetch(sorteiosData.messageID)
                const time = sorteiosData.time
                const usersDB = sorteiosData.reactedUsers

                if (time < Date.now()) {

                    const finalizedForNoReactEmbed = new MessageEmbed()
                        .setTitle(`${sorteiosData.award}`)
                        .setColor('#ff0000')
                        .setDescription(`O sorteio não havia participantes o suficiente.`)
                        .addField(`Ganhador`, `Nenhum.`, true)
                        .addField(`Hosteado por`, `<@${sorteiosData.authorID}>`, true)

                    if (usersDB.length <= 1) {
                        await sorteiosSchema.findOneAndUpdate({ messageID: message.id }, { status: 'finalizado' });
                        return message.edit({ content: 'Sorteio finalizado!', embeds: [finalizedForNoReactEmbed], components: [] })
                    };

                    var rand = usersDB[Math.floor(Math.random() * usersDB.length)];

                    const getCache = guild.members.cache.get(rand)

                    const finalizedEmbed = new MessageEmbed()
                        .setTitle(`${sorteiosData.award}`)
                        .setColor('#ff0000')
                        .addField(`Ganhador`, `<@${getCache.id}>`)
                        .addField(`Hosteado por`, `${sorteiosData.authorID}`)

                    if (!sorteiosData.description == null) {
                        await finalizedEmbed.setDescription(sorteiosData.description)
                    }

                    message.edit({ content: 'Sorteio finalizado!', embeds: [finalizedEmbed], components: [] })
                    await sorteiosSchema.findOneAndUpdate({ messageID: messageID }, {
                        status: 'finalizado',
                        winnerID: getCache.id,
                        $pull: {
                            reactedUsers: getCache.id
                        }
                    });
                }
            } catch (err) {
                console.log(`Erro em sortear`, err)
            }

        }, 2000)
    }
}