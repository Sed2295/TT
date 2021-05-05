const express = require('express');
const path = require('path');
var ip = require('ip');
const app = express();
const session = require('express-session');
const Usuario = require('../Modelo/usuario');
var nodemailer = require('nodemailer');
app.use(session({ secret: 'guinea pig', cookie: { maxAge: 60*1000 }, resave: false, saveUninitialized: true}));
//const mail = require('mail').Mail({host:"smtp.gmail.com",username:"djbrush1122@gmail.com",password:"2011080169"});

app.post('/restablecer',  async(req,res)=>{
    let body = req.body;

    ip.address();
    let myIp = ip.toString(new Buffer(ip.toBuffer(ip.address())));
    console.log(body.email);
    await Usuario.findOne({Correo: body.email}, (err, usuarioDB) => {
        let textohtml =   '<div>'
            +   '<h1>Restablecer contraseña</h1>'
            +   '<hr>'
            +   'Da clic en el siguiente enlace para restablecer su contraseña: <br>'
            +   `<form action="http://${myIp}:3000/recuperarContrasena"  method="post" style="text-align: center;">`
            +   `<input type="hidden" name="user" value="${usuarioDB._id}">`
            +   '<input type="submit" value="Abrir documento">'
            +   '</form>'
            + '</div>';

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
            subject: 'Restablecer contraseña',
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
        res.sendFile(path.resolve(__dirname,"../../public/index.html"));
        //res.json({UsuarioDB});
    })




});

module.exports = app;