const express = require('express');
const app = express();
const session = require('express-session');
const path = require('path');
app.use(session({ secret: 'guinea pig', cookie: { maxAge: 3000*1000 }, resave: false, saveUninitialized: true}));
const Documento = require('../Modelo/documento');
const Usuario = require( '../Modelo/usuario');
const VersionOld = require('../Modelo/VersionOld');

app.get('/documento', function(req, res) {
    if(!req.session.user){
        return res.redirect('/');
    }

    res.sendFile(path.resolve(__dirname,"../../public/PaginaPrincipal.html"));
});

app.get('/documento/create', async function (req, res) {
     if(!req.session.user){
         res.redirect('/');
     }
     let nuevoDoc = new Documento({
        Propietario: req.session.user
     });

     let saveDocument =  await nuevoDoc.save();
     req.session.documentID = saveDocument._id;
     res.redirect('/editor');
});

app.post('/documento/update', (req, res) => {
    let body = req.body;
    let id = req.session.documentID;
    let Texto = body.texto;
    let Titulo = body.titulo;
    let Fecha = Date.now();
    console.log('Body: ', body);
    let doc =  Documento.findByIdAndUpdate(id, {new: true, Titulo, Texto, Fecha, runValidators: true}, (err, DocumentoDB) => {
        if(!DocumentoDB){
            return res.status(400).json({
                ok: false,
                err
            });
            return res.json({
                mensaje: 'ok'
            });
        }
    });
});

app.get('/documento/loadDoc/:id', (req, res) => {
   let documentId = req.session.documentID;
   if(!documentId){
       return res.redirect('/documento');
   }
   if(req.session.old){
       let oldDoc = VersionOld.find({DocOriginal: documentId, Version: req.session.ver}, (err, docOldDB) => {
           if(err){
               return res.status(400);
           }
           return res.json({
               titulo: 'Version ' + req.session.ver,
               texto: docOldDB.Texto,
               votacion: true
           });
       });
   }
    let doc = Documento.findById(documentId, (err, documentoDB) => {
        if(err){
            return res.status(400);
        }
        return res.json({
            titulo: documentoDB.Titulo,
            texto: documentoDB.Texto,
            votacion: documentoDB.Votacion
        });
    });
});

app.get('/documento/loadDocOld/:id/:ver', (req, res) => {
    let documentId = req.params.id;
    let documentVer = req.params.ver;
    if(!documentId){
        return res.redirect('/documento');
    }
    let doc = VersionOld.find({DocOriginal: documentId, Version: documentVer}, (err, documentoOldDB) => {
        if(err){
            return res.status(400);
        }
        req.session.documentID = documentId;
        req.session.ver = documentVer;
        req.session.old = true;
        res.redirect('/editor');
    });
});


app.get('/documento/load/:id', async (req, res) => {
   let documentId = req.params.id;
   if(!documentId){
       return res.redirect('/documento');
   }
   let doc = await Documento.findById(documentId, (err, documentoDB) => {
      if(err){
          return res.status(400);
      }
      req.session.documentID = documentoDB._id;
      //req.session.Texto = documentoDB.Texto;
      //req.session.Titulo = documentoDB.Titulo;
      res.redirect('/editor');
   });

});

app.get('/documento/loadAll', async (req, res) => {
   let userId = req.session.user;
   let docs = await Documento.find({Propietario: userId}).exec((err, documentos) => {
       if(err){
           return res.status(500);
       }
       console.log('loadAll:' + JSON.stringify(documentos));
       res.json(JSON.stringify(documentos));
   });

});

app.get('/documento/loadAllShared', async (req, res) => {
    let sharedUser = "";
    let userId = req.session.user;
    let user = await Usuario.findById(userId, (err, user) => {
        sharedUser = user.Correo;

    });
    console.log('SharedUser:' + user.Correo);
   let docs = await Documento.find({PersonasCompartidas: sharedUser}).exec((err, documentos) => {
       if(err){
           return res.status(500);
       }
       console.log('loadAllShared:' + JSON.stringify(documentos));
       res.json(JSON.stringify(documentos));
   });

});

app.post('/document/getSessionDocumentID', (req, res) => {
    console.log(req.session.documentID);
    return res.json({id :req.session.documentID});
});

module.exports = app;