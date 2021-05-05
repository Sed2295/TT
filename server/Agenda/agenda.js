const Agenda = require('agenda');
//const mongoose = require('mongoose');
const { MongoClient } = require('mongodb');
const nodemailer = require('nodemailer');
const ip = require('ip');
const Documento = require('../Modelo/documento');
const Comentario = require('../Modelo/comentario');
const Votacion = require('../Modelo/votacion');
const VersionOld = require('../Modelo/VersionOld');

const agenda = new Agenda({db: {address: process.env.URLDB}});

agenda.define('terminarVotacion', {priority: 'high', concurrency: 10},  async (job, done) => {
    //Attrs: correos, documentID
    const {correos} = job.attrs.data;
    const {documentID} = job.attrs.data;
    ip.address();
    let comentarios = [];
    let newText = '';

    //Contar votos de los comentarios
    let coment = await  Comentario.find({Documento: documentID, Puntuacion: {$gte: 1}},(err, coms) => {
        for(let i=0;i<coms.length;i++){
            comentarios.push({ref: coms[i].Referencia, text: coms[i].Texto});
        }
    });
    let doc = await Documento.findById(documentID, (err, documentoDB) => {
        if(err){
            console.log(err);
        }
        let tempText = documentoDB.Texto;

        for (let i = 0; i < comentarios.length; i++) {
            let targ = `createListener(${comentarios[i].ref})">`;
            let startIndex = tempText.indexOf(targ);
            let prevText = tempText.substring(0, startIndex+targ.length);
            let longText = tempText.split(targ)[1].indexOf('</span>');
            let postText = tempText.substring(prevText.length + longText);
            newText = prevText + comentarios[i].text + postText;
        }
    });
    console.log('comentarios:' + JSON.stringify(comentarios));
    console.log(newText);

    let newTextDoc = await Documento.findByIdAndUpdate(documentID,{new: true, Texto: newText}, (err, documentoDB) => {
        if(err){
            console.log(err);
        }
        console.log('Cambios realizados!');
    });

    //Enviar notificación a los usuarios
    let myIp = ip.toString(new Buffer(ip.toBuffer(ip.address())));
    let url = documentID;

    let textohtml =   '<div>'
        +   '<h1>La votacion ha finalizado.</h1>'
        +   '<hr>'
        +   '<p>Acceda para ver la version generada.</p>'
        +   '<div style="text-align: center;"><a href=\"http://'+myIp+':3000/'+url.split('3000/')[1]+'\">Abrir documento</a></div>'
        + '</div>';

    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'djbrush1122@gmail.com',
            pass: 'Qwertyuiop0'
        },
        tls: {
            rejectUnauthorized: false
        }
    });

    let mailOptions = {
        from: 'djbrush1122@gmail.com',
        to: correos.join(' ,'),
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

    //Generar nueva version.
    let docID;
    let oldText;
    let lastVersion;

    let documento = await Documento.findByIdAndUpdate(documentID,{$inc: {Version: 1}}, {new: true, Votacion: false}, (err, documentoDB) => {
        if(err){
            console.log(err);
        }
        docID = documentoDB._id;
        oldText = documentoDB.Texto;
        lastVersion = documentoDB.Version;
    });
    if(lastVersion === 0){
        done();
    }

    let nuevoDoc = new VersionOld({
       DocOriginal:  documentID,
       Version: lastVersion-1,
       Texto: oldText,
    });

    nuevoDoc.save();
    done();
});


module.exports = agenda;
