const express = require('express');
const path = require('path');
const app = express();
const Usuario = require('../Modelo/usuario');

app.post('/recuperarContrasena/', (req, res) =>{
	let id = req.body.user;
	console.log('user' + req.body.user);
	res.cookie('user', id);
	res.sendFile(path.resolve(__dirname,"../../public/RecuperarContrasena2.html"));

});

app.post('/cambiar', (req, res) => {
	let body = req.body;
	Usuario.findByIdAndUpdate(body.id,{Contrasena: body.passw},{new:true, runValidators: true}, (err, User) => {
		if(err){
			return res.status(400).json({err});
		}
		if(!User){
			return res.status(400).json({err, men: 'No se encontro el usuario.'});
		}
		res.redirect('/');
		//res.sendFile(path.resolve(__dirname,"../../public/contrasenaRestablecida.html"));
		//res.json({User});
	})
});

module.exports = app;