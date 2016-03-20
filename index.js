/*

HACKATHON PROJECT

This was a Tessel hackathon project where we were presented with a tessel which included a climate and servo module.
The general idea of this program is that a cup of coffee was placed in the cupholder built. The cupholder touched the climate module to measure the temperature. If a request was sent via our web-app and the temperature was too hot, the tessel started the servo module to commence the stirring of the coffee. 

When the appropriate temperature is reached, the servo stops stirring, and initiates an http request to this web app which then utilized twilio to send a text message to the user that the coffee is ready.

*/

'use strict';
require('dotenv').config();
var client = require('twilio')(process.env.account_sid, process.env.auth_token);
var path = require('path');
var express = require('express');
var app = express();
module.exports = app;

app.use(express.static('./sirvo'));

app.use(function(req, res, next) {
    if (path.extname(req.path).length > 0) {
        res.status(404).end();
    } else {
        next(null);
    }
});

app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname, './../sirvo/index.html'));
});

app.get('/ready', function(req, res) {
    sendText(process.env.number, process.env.twilio_num, "Your coffee's ready!");

    function sendText(to, from, msg) {
        client.sms.messages.create({
            to: to,
            from: from,
            body: msg
        }, function(error, message) {
            if (!error) {
                // console.log('Success! The SID for this SMS message is:');
                // console.log(message.sid);
                // console.log('Message sent on:');
                // console.log(message.dateCreated);
            } else {
                console.log('Oops! There was an error.', error);
            }
        });
    }
    res.redirect('/');
});

app.listen(8000);

app.use(function(err, req, res, next) {
    console.error(err.status);
    res.status(err.status || 500).send(err.message || 'Internal server error.');
})