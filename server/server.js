require('./config/config');
const express = require('express');
const path = require('path');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');


//Configuracion de Express
//--
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use( require('./routes/index') );
//--
app.use(session({ secret: 'TTA025', cookie: { maxAge: 300 }, resave: true, saveUninitialized: true}));

//Habilitar ruta publica.
const publicPath = path.resolve(__dirname, '../public');
app.use(express.static(publicPath));

//Conectar a la base de datos
mongoose.connect(process.env.URLDB, (err,res) =>{
	if(err){
		throw err;
	}
	console.log('Base de datos conectada');
});

//Escuchar peticiones
app.listen(process.env.PORT, () =>{
  console.log('Escuchano puerto: ', process.env.PORT);
});
