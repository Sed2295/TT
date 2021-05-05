const mongoose = require('mongoose');
let Schema = mongoose.Schema;

let votacionSchema = new Schema({
    Documento: {
      type: String,
      required: true
    },
    Fecha: {
        type: Date,
        requied: true
    },
    Participantes: {
        type: [Schema.Types.ObjectId],
        required: true
    },
    VotosEmitidos: {
        type: [Schema.Types.ObjectId],
        required: true
    }
});

module.exports = mongoose.model('Votacion',votacionSchema);