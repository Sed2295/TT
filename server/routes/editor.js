const express = require('express');
const app = express();
const path = require('path');
const session = require('express-session');
const Documento = require('../Modelo/documento');



app.get('/editor', async function (req, res) {
    if(!req.session.user){
        return res.redirect('/');
    }

    // req.session.save(()=>{
    //     console.log(`${req.session.id}: Session saved`);
    // });
    res.cookie('documentoID', req.session.documentID);
    res.cookie('name', req.session.userName);
    let doc = await Documento.findById(req.session.documentID,'Texto', (err, document) => {
        if(err){
            return res.redirect('/documento');
        }
        res.cookie('texto', document.Texto);
        res.sendFile(path.resolve(__dirname, "../../public/EditorTexto.html"));
    });



});

module.exports = app;