var MONGOHQ_URL = "mongodb://swpoa:salaoswpoa12345@linus.mongohq.com:10057/app30795804";

var express = require('express'),
    http = require('http'),
    https = require("https"),
    path = require('path'),
    mongoose = require("mongoose"),
    querystring = require('querystring'),
    _ = require('underscore');

var ObjectId = mongoose.Schema.Types.ObjectId;

mongoose.connect(process.env.MONGOHQ_URL || MONGOHQ_URL);
Salon = mongoose.model('Salon', {
    name: String,
    email: String,
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
        client: ObjectId,
        rating: Number,
        date: Date
    }],
    comments: [{
        client: ObjectId,
        body: String,
        date: Date
    }],
    services: [{
        name: String,
        price: Number
    }],
    appointments: [{
        client: ObjectId,
        date: Date,
        service: String
    }]

});


var app = express();

app.configure(function() {
    app.set('port', process.env.PORT || 8000);
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

    Salon.find({}, function(err, saloes){
        res.render('index', {saloes: saloes});
    });

});

app.get('/cadastro', function(req, res) {

    res.render('cadastro');

});

app.post('/cadastro', function(req, res) {

    //console.log(req.body.salon);
    var salon = Salon(req.body.salon);

    salon.save(function(err, data) {

        if (err) res.send(500);
        res.redirect('/');
        
    });

});

app.post('/schedule', function(req, res) {

    res.send(req.body);

});


var sv = http.createServer(app);
io = require('socket.io').listen(sv);
io.set('log level', 1);

io.on('connection', function(socket) {
    socket.on('message', function(data) {
        io.sockets.emit('message', data);
    });


});

var port = process.env.PORT || 8080;
sv.listen(port, function() {
    console.log("Listening on " + port);
});
