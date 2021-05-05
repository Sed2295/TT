const mongoose = require('mongoose');
let Schema = mongoose.Schema;

let documentoSchema = new Schema({
	Propietario: {
		type:       Schema.Types.ObjectId, ref: 'Usuarios',
		required:   [true, "El documento debe tener un propietario."]
	},
	Titulo: {
		type:       String,
		required:   true,
		default:    "Documento sin titulo"
	},
	Texto: {
		type:       String,
		require:    false,
		default:    " "
	},

	PersonasCompartidas: {
		type:       [String],
		required:   false
	},

	Version: {
		type:       Number,
		require:    true,
		default:    0


	},
	Fecha: {
		type:       Number,
		required:   true,
        default:    Date.now()
	},
	Votacion: {
		type: Boolean,
		required: false,
		default: false
	}


});

module.exports = mongoose.model('Documento',documentoSchema);