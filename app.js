var MONGOHQ_URL = "mongodb://huia:aaa123@kahana.mongohq.com:10002/app30051564"

var express = require('express'),
    http = require('http'),
    https = require("https"),
    path = require('path'),
    mongoose = require("mongoose"),
    querystring = require('querystring'),
    _ = require('underscore')
    //, io = require('socket.io')

mongoose.connect(process.env.MONGOHQ_URL || MONGOHQ_URL);
Salon = mongoose.model('Salon', {
    name: String,
    image: String,
    location: {
        latitude: Number,
        longitude: Number,
        number: String,
        street: String,
        city: String,
        cep: String,
        country: String,
        uf: String
    },
    ratings: [{
        user_id: String,
        rating: Number,
        date: Date
    }],
    comments: [{
        author: String,
        body: String,
        date: Date
    }],
    services: [{
        name: String,
        price: Number
    }],
    appointments: [{
        user_id: String,
        date: Date,
        service: String
    }],

});


var app = express();

app.configure(function() {
    app.set('port', process.env.PORT || 8080);
    app.set('views', __dirname + '/views');
    app.set('view engine', 'ejs');
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(express.cookieParser('swpoa'));
    app.use(express.session());
    app.use(app.router);
    app.use(express.static(path.join(__dirname, 'public')));
});


app.get('/', function(req, res) {

    res.render('index');

});

app.post('/schedule', function(req, res) {

    res.send(req.body);

});


var sv = http.createServer(app);
var io = require('socket.io').listen(sv);
io.set('log level', 1);

var port = process.env.PORT || 7070;
sv.listen(port, function() {
    console.log("Listening on " + port);
});
