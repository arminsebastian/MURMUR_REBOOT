
var helpers = require('./helpers');

var express = require('express'),
    querystring = require('querystring'),
    mongoose    = require('mongoose'),
    bodyParser = require('body-parser');
    uriUtil = require('mongodb-uri');
    // MongoWatch = require('mongo-watch');

var app = express();

var env = process.env.NODE_ENV = process.env.NODE_ENV || 'development';

var mongoURI = process.env.MONGOLAB_URI || "mongodb://localhost:27017";

var mongooseUri = uriUtil.formatMongoose(mongoURI);
var MongoDB = mongoose.connect(mongooseUri).connection;
MongoDB.on('error', function(err) { console.log(err.message); });
MongoDB.once('open', function() {
  console.log("mongodb connection open");
});

// var watcher = new MongoWatch({format: 'pretty'});

// watcher.watch('rooms', function(event) {
//   console.log('event');
// });

app.use(express.static(__dirname + '/../client'));

var server = app.listen((process.env.PORT || 3000), function () {
  var host = server.address().address;
  var port = server.address().port;
  // console.log('Example app listening at http://%s:%s', host, port);
});

app.use(bodyParser.json());

app.get('/v/*', helpers.signup);

app.post('/signup', helpers.verify);

app.post('/', helpers.addMessage);

app.post('/checkroom', helpers.checkRoomExists);

app.post('/signin', helpers.signin);

app.post('/create', helpers.createRoom);

// app.post('/comment', helpers.comment);

app.post('/vote', helpers.vote);

// app.post('/voteComment', helpers.voteComment);

app.post('/favorites', helpers.updateFavorites);
