const express = require('express');
const path = require('path');
var nodemailer = require('nodemailer');
var ip = require('ip');
const app = express();
const Documento = require('../Modelo/documento');

app.post('/enviarInvitacion', (req, res) => {
    let body = req.body;
    ip.address();
    let myIp = ip.toString(new Buffer(ip.toBuffer(ip.address())));
    let url = body.urlDoc;
    console.log(myIp, body);


    let textohtml =   '<div>'
                    +   '<h1>Se le ha invitado para colaborar en el siguiente documento: DocumentoPrueba</h1>'
                    +   '<hr>'
                    +   '<div style="text-align: center;"><a href=\"http://'+myIp+':3000/'+url.split('3000/')[1]+'\">Abrir documento</a></div>'
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
        to: body.correo,
        subject: 'Invitacion a colaborar',
        text: 'That was easy!',
        html: textohtml
    };

    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
            Documento.update({_id: req.session.documentID}, {$push: {PersonasCompartidas: [body.correo]}}, (error, writeOpResult) => {
                if(error){
                    console.log(error);
                }
                else{
                    console.log('Actualizado');
                }
            });
        }
    });
    res.redirect('/editor');
});

module.exports = app;