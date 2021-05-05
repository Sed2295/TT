const express = require('express');
const app = express();
const session = require('express-session');
var ip = require('ip');
var nodemailer = require('nodemailer');
app.use(session({ secret: 'guinea pig', cookie: { maxAge: 3000*1000 }, resave: false, saveUninitialized: true}));
const Documento = require('../Modelo/documento');
const Usuario = require( '../Modelo/usuario');
const Comentario = require('../Modelo/comentario');
const Votacion = require('../Modelo/votacion');
const agenda = require('../Agenda/agenda');

app.post('/votacion/iniciar', async (req,res) => {
    let body = req.body;
    ip.address();
    let myIp = ip.toString(new Buffer(ip.toBuffer(ip.address())));
    let url = body.urlDoc;
    let documentId = req.session.documentID;
    let correos = [];
    let doc = await Documento.findByIdAndUpdate(documentId,{new: true, Votacion: true}, (err, documentoDB) => {
       if(err){
           return err;
       }
       if(documentoDB.PersonasCompartidas.length === 0){
           return res.json({
               mensaje: 'Debe haber por lo menos 2 participantes para iniciar la votación.'
           })
       }
       correos = documentoDB.PersonasCompartidas;
        console.log('votacion/iniciar/findById: ' + correos);
    });
    await setTimeout (()=>{},1000);
    console.log('votacion/iniciar: ' + correos);
    let textohtml =   '<div>'
        +   '<h1>Se ha iniciado un proceso de votación</h1>'
        +   '<hr>'
        +   '<p>Acceda al documento para revisar los cambios.</p>'
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
        to: correos.join(', '),
        subject: 'Proceso de votacion',
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

    agenda.start();
    agenda.schedule('one minute', 'terminarVotacion', {correos, documentID: documentId});


});



module.exports = app;