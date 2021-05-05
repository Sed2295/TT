const session = require('express-session');


let verificarSession = (req, res, next) => {
    if(!req.session.id){
        return res.redirect('/');
    }
    return next();
};

let verificaUser = (req, res, next) => {
    if(!req.session.user){
        res.redirect('/');
    }
    next();
};

module.exports = {
    verificarSession,
    verificaUser
};