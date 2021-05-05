const express = require('express');
const app = express();
const session = require('express-session');
const path = require('path');
app.use(session({ secret: 'TTA025', cookie: { maxAge: 3000*1000 }, resave: false, saveUninitialized: true}));
const Documento = require('../Modelo/documento');
const Usuario = require( '../Modelo/usuario');
const Comentario = require('../Modelo/comentario');


app.post('/comentario/guardar', async (req, res) => {
    if(!req.session.user){
        res.redirect('/');
    }
    let body = req.body;
    let nuevoComentario = new Comentario({
       Propietario: req.session.user,
       Documento: req.session.documentID,
       Texto: body.texto,
       Referencia: body.referencia
    });

    await nuevoComentario.save((err, com) =>{
        if(err){
            return res.json({
                err
            });
        }
        return res.json({
            com
        })
    });

});

app.post('/comentario/obtenerTexto', (req, res) => {
    let ref = req.body.ref;
    console.log('/comentario/:ref:   '+ ref);
    let comentario = Comentario.find({Referencia: ref}, (err, comentarioDB) => {
        if(err){
            return res.json(err);
        }
        if(!comentarioDB){
            console.log('/comentario/:id:   noDB');
            console.log(err);
            return res.json(err);
        }
        console.log('/comentario/:id: '+comentarioDB);
        res.json({
            texto: comentarioDB
        });
    })
});

app.post('/comentario/emitirVoto', (req, res) => {
   let id = req.body.id;
   let valor = req.body.valor;
   let comentario = Comentario.findOneAndUpdate({Referencia: id},{$inc: {Puntuacion: valor}},{new: true}, (err, comentarioDB) => {
       if(err){
           return res.json(err);
       }
        console.log(comentarioDB.Puntuacion);
   });


});

module.exports = app;