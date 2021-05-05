const mongoose = require('mongoose');
let Schema = mongoose.Schema;

let comentarioSchema = new Schema({
    Propietario: {
        //type: Schema.Types.ObjectId, ref: 'Usuarios',
        type: String,
        required: [true, "El documento debe tener un propietario."]
    },
    Texto: {
        type: String,
        require: true,
        default: " "
    },
    Referencia: {
        type: String,
        required: true
    },
    Documento: {
        //type: Schema.Types.ObjectId,
        type: String,
        required: true
    },
    Puntuacion: {
        type: Number,
        required: false,
        default: 0
    },
    VotosEmitidos: {
        type: Number,
        required: false
    }

});

module.exports = mongoose.model('Comentario',comentarioSchema);