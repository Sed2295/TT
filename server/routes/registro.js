const express = require('express');
const path = require('path');
const app = express();
const Usuario = require('../Modelo/usuario');
var ip = require('ip');
var nodemailer = require('nodemailer');
//const mail = require('mail').Mail({host:"smtp.gmail.com",username:"djbrush1122@gmail.com",password:"2011080169"});

app.post('/registro', (req,res)=>{
	let body = req.body;
	ip.address();
	let myIp = ip.toString(new Buffer(ip.toBuffer(ip.address())));
	let NuevoUsuario = new Usuario({

		Nombre: body.nombre,
		Apellidos: body.apellidos,
		Correo: body.email,
		Contrasena: body.pass

	});

	NuevoUsuario.save((err,UsuarioDB)=>{
		if(err){
			return res.json({err});
		}
		console.log(UsuarioDB._id.toString());
		let textohtml = '<div><a href="http://'+myIp+':3000/activarUsuario/'+UsuarioDB._id.toString()+'">Activar Cuenta</a></div>';
		//'<form action="/activarUsuario" method="post">'
		//+ '<input name="id" type="hidden" value="'+UsuarioDB._id.toString()+'"/>'
		//+ '<input type="submit" value="Confirmar Correo"/>'
		//+ '</form>';
		var transporter = nodemailer.createTransport({
			service: 'gmail',
			auth: {
		user: 'djbrush1122@gmail.com',
		pass: 'Qwertyuiop0'
					},
					tls: {
		    	rejectUnauthorized: false
		}
		});

		var mailOptions = {
		from: 'djbrush1122@gmail.com',
		to: body.email,
		subject: 'Prueba',
		text: 'That was easy!',
		html: textohtml
		};

		transporter.sendMail(mailOptions, function(error, info){
			if (error) {
			console.log(error);
			} else {
			console.log('Email sent: ' + info.response);
			}
		});
		res.sendFile(path.resolve(__dirname,"../../public/espera_confirmacion.html"));
		//res.json({UsuarioDB});
	})


})

module.exports = app;