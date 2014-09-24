'use strict';

var React = require('react');
var express = require('express');
var app = express();

require('node-jsx').install();

var helloWorld = require('./static/scripts/components/hello-world.js');
var goodbyeWorld = require('./static/scripts/components/goodbye-world.js');
var page = require('./static/scripts/components/page.js');


app.get('/', function (req, res) {
    // res.send('<html><head></head><body>' + React.renderComponentToString(helloWorld()) + '</body></html>');

    // var sub = React.renderComponentToString(helloWorld(goodbyeWorld()));
    var sub = helloWorld;
    // how do i do nesting?
    res.send(React.renderComponentToString(page({
        subComponent: sub
    })))
});
app.get('/goodbye', function (req, res) {
    res.send('<html><head></head><body>' + React.renderComponentToString(goodbyeWorld()) + '</body></html>');
});

app.listen(1337);
