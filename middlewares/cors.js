'use strict';
const cors = require('koa2-cors');

// Create cors middleware
const corsControl = cors({
    origin: 'https://192.168.10.101:8000', // If you want to send cookies, Access-Control-Allow-Origin cannot be set to '*'.
    exposeHeaders: [
        'WWW-Authenticate',
        'Server-Authorization',
        'Authorization',
        'SessionID',
    ],
    maxAge: 5,
    credentials: true,
    allowMethods: ['GET', 'POST'],
    allowHeaders: ['Content-Type', 'Authorization', 'Accept', 'SessionID']
});

module.exports = {
    corsControl,
};

// Options
// origin
// Configures the Access-Control-Allow-Origin CORS header. expects a string. Can also be set to a function, which takes the ctx as the first parameter.

// exposeHeaders
// Configures the Access-Control-Expose-Headers CORS header. Expects a comma-delimited array.

// maxAge
// Configures the Access-Control-Max-Age CORS header. Expects a Number.

// credentials
// Configures the Access-Control-Allow-Credentials CORS header. Expects a Boolean.

// allowMethods
// Configures the Access-Control-Allow-Methods CORS header. Expects a comma-delimited array , If not specified, default allowMethods is ['GET', 'PUT', 'POST', 'PATCH', 'DELETE', 'HEAD', 'OPTIONS'].

// allowHeaders
// Configures the Access-Control-Allow-Headers CORS header. Expects a comma-delimited array . If not specified, defaults to reflecting the headers specified in the request's Access-Control-Request-Headers header.
