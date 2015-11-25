var express = require('express');
var path = require('path');

var app = express();
var rootPath = path.resolve(__dirname + '/../../');

var server_port = process.env.OPENSHIFT_NODEJS_PORT || 8080
var server_ip_address = process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1'

app.use(express.static(rootPath));

app.all('/*', function ( req, res ) {
        res.status(200)
            .set( {'content-type': 'text/html; charset=utf-8' })
            .sendFile(rootPath + '/index.html');
});

app.listen(server_port, server_ip_address);

console.log('Server is running...');
