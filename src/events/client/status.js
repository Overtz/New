const Event = require('../../structures/Event')

module.exports = class extends Event {
    constructor(client) {
        super(client, {
            name: 'ready'
        })
    }
    run = async () => {
        let activities = [
            `Cuidando do Servidor...`,
            `/help`
          ],
          i = 0;
          setInterval(() => this.client.user.setActivity(`${activities[i++ % activities.length]}`, {
            type: "PLAYING"
          }), 30000); //WATCHING, LISTENING, PLAYING, STREAMING          
    }
}