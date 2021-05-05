const express = require('express');
const path = require('path');
const app = express();
const Usuario = require('../Modelo/usuario');

app.get('/activarUsuario/:id', (req, res) => {
	let id =  req.params.id;
	//res.json({id});

	Usuario.findByIdAndUpdate(id,{Estatus: 'true'},{new:true, runValidators: true}, (err, User) => {
		if(err){
			return res.status(400).json({err});
		}
		if(!User){
			return res.status(400).json({err, men: 'No se encontro el usuario.'});
		}
		res.sendFile(path.resolve(__dirname,"../../public/confirmacion_completa.html"));
		//res.json({User});
	})
});

module.exports = app;