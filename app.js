/*
 *  Travail pratique 2
 *  INF4375 - Paradigmes des échanges Internet
 *
 *  Pierre-Olivier Blouin
 *  BLOP11068701
 *  blouin.pierre-olivier.2@courrier.uqam.ca
 *
 *
 *  Ce programme est un back-end offrant des services REST pour manipuler
 *  les données migrées dans MongoDB dans le TP1.
 *
 *  Veuillez consulter README.md pour savoir comment démarrer le serveur.
 *
 *  Considérations techniques
 *     $ node -v v0.10.32
 *     $ mongo -version MongoDB shell version: 2.6.5
 *     $ express --version 4.9.0
 */
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var bodyParser = require('body-parser');
var mongo_client = require('mongodb').MongoClient;

var routes = require('./routes/index');
var dossiers = require('./routes/dossiers');
var professionnels = require('./routes/professionnels');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.set('port', process.env.PORT || 3000);
app.set('json spaces', 4);

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(require('stylus').middleware(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));

// Insère une connection db dans les requêtes.
var db;
app.use(function(req, res, next) {
    req.db = db;
    next();
});

app.use('/', routes);
app.use('/dossiers', dossiers);
app.use('/pros', professionnels);

// Pool MongoDB.
mongo_client.connect('mongodb://localhost:27017/BLOP11068701', {"auto_reconnect" : true}, function(err, database, next) {
    if(err) next(err);
    db = database;
    app.listen(app.get('port'));
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('404 - Ressource inexistante.');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message : err.message,
            error : err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message : err.message,
        error : {}
    });
});

module.exports = app;
