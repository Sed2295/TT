const express = require('express');
const path = require('path');
const app = express();
const session = require('express-session');
const Usuario = require('../Modelo/usuario');
app.use(session({ secret: 'TTA025', cookie: { maxAge: 60*1000 }, resave: false, saveUninitialized: true}));

app.post('/login', (req, res) => {
    if(req.session.user){
        return res.json({
            mensaje: 'Ok'
        });
    }

    let body = req.body;
    console.log(body);
    Usuario.findOne({  Correo: body.email },(err,UsuarioDB) =>{
            if(err){
                return res.json({
                    err
                });
            }

            if(!UsuarioDB){
                return res.json({
                    mensaje: 'Incorrecto'
                });
            }

            if(UsuarioDB.Estatus === false){
                return res.json({
                    mensaje: 'Inactivo'
                });
            }

           if (UsuarioDB.Contrasena === body.pass && UsuarioDB.Estatus === true) {

               //Crear pagina de sesion donde aprecen los documentos creados del usuario
               req.session.userName = UsuarioDB.Nombre;
               req.session.user = `${UsuarioDB._id}`;
               return res.json({
                   mensaje: 'Ok'
               });
               //return res.redirect(`/documento`);

           }else{
                return res.json({
                    mensaje: 'Incorrecto'
                })
                    //res.sendFile(path.resolve(__dirname,"../../public/index.html"));
           }

    })
});

app.get('/login', (req, res) => {
    if(req.session.user){
        return res.redirect('/documento');
    }
    else{
        return res.redirect('/');
    }
});


module.exports = app;