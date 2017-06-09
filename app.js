var path = require('path');
var engines = require('consolidate');
var bodyParser = require('body-parser');
var favicon = require('serve-favicon');
var morgan = require('morgan')

var express = require('express');
var app = express();

app.use(morgan('tiny'));

app.set('views', './views');
app.engine('html', engines.mustache);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

var index = require('./routes/index');
app.use('/', index);

var id = require('./routes/id');
app.use('/id', id);

app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')))
app.use(express.static('./public'));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found ' + req.path);
    err.status = 404;
    next(err);
});

// error handler
app.use(function(err, req, res, next) {
    res.send('Bad Request');
});

module.exports = app;
