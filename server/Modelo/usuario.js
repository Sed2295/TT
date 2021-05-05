const mongoose = require('mongoose');
let Schema = mongoose.Schema;

let usuarioSchema = new Schema({

	Nombre: {
		type: String,
		required: [true,"Nombre obligatorio"] 
	},

	Apellidos: {
		type: String,
		required: [true,"Apellidos obligatorios"]
	},

	Contrasena: {

		type: String,
		required:[true, "Contraseña obligatoria"]
	},

	Correo: {
		type: String,
		required: [true,"Correo obligatorio"]
	},

	Estatus: {
		type: Boolean,
		default: false

	}
});

module.exports = mongoose.model('Usuarios',usuarioSchema);