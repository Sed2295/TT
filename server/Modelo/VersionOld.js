const mongoose = require('mongoose');
let Schema = mongoose.Schema;

let documentoOldSchema = new Schema({
    DocOriginal: {
        type: String,
        required: [true, "El documento debe tener un propietario."]
    },
    Version: {
        type: Number,
        require: true,
        default: 1
    },
    Texto: {
        type: String,
        require: false,
        default: " "
    },
});

module.exports = mongoose.model('VersionOld',documentoOldSchema);