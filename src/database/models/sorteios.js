const { Schema, model } = require('mongoose')

const sorteiosSchema = new Schema({

    serverID: { type: String, require: true, unique: false },
    authorID: { type: String, require: true, unique: false },
    award: { type: String, require: true, unique: false },
    description: { type: String, require: true, default: null },
    time:{ type: Number, require: true, default: 0 },
    reactedUsers: [String],
    messageID: { type: String, require: true, default: null },
    channelID: { type: String, require: true, default: null },
    winnerID: { type: String, require: true, default: null },
    status: { type: String, require: true, default: null }

})

module.exports = model('sorteios', sorteiosSchema)