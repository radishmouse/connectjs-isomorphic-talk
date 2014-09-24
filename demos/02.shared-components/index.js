
'use strict';

var path = require('path');

var React = require('react');
var express = require('express');
var app = express();

require('node-jsx').install();

var helloWorld = require('./components/hello-world.js');

app.get('/', function (req, res) {
    res.send('<html><head></head><body>' + React.renderComponentToString(helloWorld()) + '<script src="scripts/bundle.js"></script></body></html>');
});
app.use('/scripts', express.static(path.join(__dirname, 'static/scripts')))
// app.get('/goodbye', function (req, res) {
//     res.send('<html><head></head><body>' + React.renderComponentToString(goodbyeWorld()) + '</body></html>');
// });

app.listen(1337);
