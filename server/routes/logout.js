const express = require('express');
const path = require('path');
const app = express();

app.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/');
});

module.exports = app;