var express = require('express');
var http = require('http');
//var router = express.Router();
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var Twit = require('twit');
var routes = require('./routes/index');
var users = require('./routes/users');




var app = express();

var T = new Twit({
  consumer_key:         'GEAHg7AuAHqNx9No2WxOdxigJ',
  consumer_secret:      'duCJOP3gOjQRDNSiwvpJU5bSFZMd0FelZUfMnY4npCIYFN4Y8R',
  access_token:         '1330589587-0gI7cBYq52qWyjsN80v80P5QuUNsiNXfO4dYEci',
  access_token_secret:  'bDQS5g09MijdbbU37AuMTqMO1GVrZ1IxL1Zdc0Q74s9Bm',
  timeout_ms:           60*1000,  // optional HTTP request timeout to apply to all requests.
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'views')));

app.use('/', routes);
app.use('/users', users);



// Put REST methods here
var filteredOpinions = {statuses:[]};
var filteredWeather = {statuses:[]};
var filteredCrime = {statuses:[]};
var filteredTraffic= {statuses:[]};

var lbboxs = [[25.729359358661515,-80.48455143735303, "75mi"],
    [25.666953112123483,-80.28453463828114, "75mi"],
    [26.299663514132654,-80.94963442651449, "75mi"],
    [26.55513561091615,-80.49477386697342, "75mi"],
    [26.94421126204889,-81.15039957517484, "75mi"],
    [25.96585913168237,-82.01287898290927, "75mi"],
    [26.548272332224304,-82.4274750451799, "75mi"],
    [26.152956427935948,-80.31619938868972, "75mi"],
    [25.13614272397523,-80.977022490546, "75mi"],
    [27.81978815131019,-80.99802467106086, "75mi"],
    [25.84664979901018,-80.35029514913889, "75mi"],
    [27.021307658272,-82.74458364012996, "75mi"],
    [28.609485290365676,-81.41873793904917, "75mi"],
    [25.935904020813314,-80.45838267262246, "75mi"],
    [26.04416504125394,-80.3463181829615, "75mi"],
    [29.38248398746543,-83.0779053469171, "75mi"]];
var rbboxs = [[25.729359358661515,-80.48455143735303, "350mi"],
    [25.666953112123483,-80.28453463828114, "350mi"],
    [26.299663514132654,-80.94963442651449, "350mi"],
    [26.55513561091615,-80.49477386697342, "350mi"],
    [26.94421126204889,-81.15039957517484, "350mi"],
    [25.96585913168237,-82.01287898290927, "350mi"],
    [26.548272332224304,-82.4274750451799, "350mi"],
    [26.152956427935948,-80.31619938868972, "350mi"],
    [25.13614272397523,-80.977022490546, "350mi"],
    [27.81978815131019,-80.99802467106086, "350mi"],
    [25.84664979901018,-80.35029514913889, "350mi"],
    [27.021307658272,-82.74458364012996, "350mi"],
    [28.609485290365676,-81.41873793904917, "350mi"],
    [25.935904020813314,-80.45838267262246, "350mi"],
    [26.04416504125394,-80.3463181829615, "350mi"],
    [29.38248398746543,-83.0779053469171, "350mi"]];

var iterOpinion = 0;
var iterWeather = 0;
var iterCrime = 0;
var iterTraffic = 0;
var lbboxsLen = lbboxs.length;

var opinionInterval = setInterval(function(){
    T.get('search/tweets', { q: 'fpl power OR solar OR energy OR outage', count: 100, geocode: lbboxs[iterOpinion]},
        function(err, data, response) {
            filteredOpinions.statuses = filteredOpinions.statuses.concat(data.statuses);
            filteredOpinions.statuses = remove_duplicates(filteredOpinions.statuses);
            iterOpinion += 1;
            if(iterOpinion == lbboxsLen-1){
                console.log("Opinions data is complete.");
                clearInterval(opinionInterval);}
        });

    },1500);
var weatherInterval = setInterval(function(){

        T.get('search/tweets', { q: 'florida storm OR lightning OR thunder OR rain', count: 100, geocode: rbboxs[iterWeather] }, function(err, data, response) {
            filteredWeather.statuses = filteredWeather.statuses.concat(data.statuses);
            filteredWeather.statuses = remove_duplicates(filteredWeather.statuses);
            iterWeather += 1;
            if(iterWeather == lbboxsLen-1){
                console.log("Weather data is complete.");
                clearInterval(weatherInterval);
            }
        });

},1500);
var crimeInterval = setInterval(function(){

    T.get('search/tweets', { q: 'florida crime OR burglary OR shooting OR fire OR robbery', count: 100, geocode: rbboxs[iterCrime] }, function(err, data, response) {
        filteredCrime.statuses = filteredCrime.statuses.concat(data.statuses);
        filteredCrime.statuses = remove_duplicates(filteredCrime.statuses);
        iterCrime += 1;
        if(iterCrime == lbboxsLen-1){
            console.log("Crime data is complete.");
            clearInterval(crimeInterval);
        }
    });

},1500);
var trafficInterval = setInterval(function(){

    T.get('search/tweets', { q: 'florida traffic OR crash OR car OR blocked', count: 100, geocode: rbboxs[iterTraffic] }, function(err, data, response) {
        filteredTraffic.statuses = filteredTraffic.statuses.concat(data.statuses);
        filteredTraffic.statuses = remove_duplicates(filteredTraffic.statuses);
        iterTraffic += 1;
        if(iterTraffic == lbboxsLen-1){
            console.log("Traffic data is complete.");
            clearInterval(trafficInterval);
        }
    });

},1500);

function remove_duplicates(objectsArray) {
    var usedObjects = {};

    for (var i=objectsArray.length - 1;i>=0;i--) {
        var so = JSON.stringify(objectsArray[i]);

        if (usedObjects[so]) {
            objectsArray.splice(i, 1);

        } else {
            usedObjects[so] = true;
        }
    }

    return objectsArray;

}

function isMarkerInsideBounds(marker, polyPoints) {
    var x = marker.lat, y = marker.lng;

    var inside = false;
    for (var i = 0, j = polyPoints.length - 1; i < polyPoints.length; j = i++) {
        var xi = polyPoints[i].lat, yi = polyPoints[i].lng;
        var xj = polyPoints[j].lat, yj = polyPoints[j].lng;

        var intersect = ((yi > y) != (yj > y))
            && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
        if (intersect) inside = !inside;
    }

    return inside;
}

var bboxfloridaAll = [{"lat":25.279470734081812,"lng":-80.43090820312499},{"lat":25.477992320574817,"lng":-80.5572509765625},{"lat":26.56887654795065,"lng":-80.2386474609375},{"lat":26.725986812271756,"lng":-80.33203125},{"lat":25.97779895546436,"lng":-80.8154296875},{"lat":26.288490072961164,"lng":-80.9197998046875},{"lat":26.26386228011112,"lng":-81.3812255859375},{"lat":25.88393659458397,"lng":-81.39770507812499},{"lat":26.007424156802212,"lng":-81.6558837890625},{"lat":26.514820023728774,"lng":-81.8756103515625},{"lat":26.676913083105454,"lng":-81.73828125},{"lat":26.701452590314368,"lng":-81.485595703125},{"lat":26.696545111585127,"lng":-81.990966796875},{"lat":26.897578097333927,"lng":-81.9854736328125},{"lat":27.039556602163195,"lng":-82.056884765625},{"lat":26.985723763197157,"lng":-82.28759765625},{"lat":27.45953933271788,"lng":-82.5347900390625},{"lat":27.868216579514076,"lng":-82.3040771484375},{"lat":27.994401411046173,"lng":-82.4139404296875},{"lat":27.97014654331592,"lng":-82.529296875},{"lat":28.038046419369945,"lng":-82.6226806640625},{"lat":28.04289477256162,"lng":-82.69958496093749},{"lat":27.9361805667694,"lng":-82.705078125},{"lat":27.843933386070514,"lng":-82.64465332031249},{"lat":27.746746268526383,"lng":-82.6885986328125},{"lat":27.86336037597851,"lng":-82.8094482421875},{"lat":28.521796040000677,"lng":-82.6116943359375},{"lat":28.998531814051795,"lng":-82.6336669921875},{"lat":29.233683670282787,"lng":-82.85888671875},{"lat":29.214507763499352,"lng":-83.0072021484375},{"lat":30.102365696412445,"lng":-83.8092041015625},{"lat":30.12612436422458,"lng":-84.2596435546875},{"lat":30.102365696412445,"lng":-84.39147949218749},{"lat":29.983486718474694,"lng":-84.4354248046875},{"lat":29.726222319395504,"lng":-85.2264404296875},{"lat":30.111869849235244,"lng":-85.462646484375},{"lat":30.292274851024256,"lng":-85.6768798828125},{"lat":30.339694848974247,"lng":-85.858154296875},{"lat":30.287531589298727,"lng":-85.9130859375},{"lat":30.53860787885458,"lng":-86.24267578125},{"lat":30.552800413453546,"lng":-86.539306640625},{"lat":30.4297295750316,"lng":-86.75354003906249},{"lat":30.62845887475364,"lng":-87.0941162109375},{"lat":30.63318556699761,"lng":-87.20947265625},{"lat":30.6662659463233,"lng":-87.3797607421875},{"lat":30.958768570779846,"lng":-87.528076171875},{"lat":30.949346915468563,"lng":-85.06164550781249},{"lat":30.64736425824319,"lng":-84.9298095703125},{"lat":30.519681272749402,"lng":-82.28759765625},{"lat":30.24957724046765,"lng":-82.16125488281249},{"lat":30.334953881988564,"lng":-81.990966796875},{"lat":30.727670895047673,"lng":-81.9525146484375},{"lat":30.65681556429287,"lng":-81.4471435546875},{"lat":30.178373310707887,"lng":-81.4581298828125},{"lat":28.878349647602047,"lng":-80.936279296875},{"lat":27.31321389856826,"lng":-80.3924560546875},{"lat":26.88288045572338,"lng":-80.0848388671875},{"lat":25.903703303407667,"lng":-80.145263671875},{"lat":25.59694832328611,"lng":-80.33752441406249},{"lat":25.37380917154398,"lng":-80.364990234375}];
var boundsfloridaAll = {"_southWest":{"lat":25.279470734081812,"lng":-87.528076171875},"_northEast":{"lat":30.958768570779846,"lng":-80.0848388671875}}
var bboxflorida = [{"lat":25.520136064403477,"lng":-80.518798828125},{"lat":25.45319497952487,"lng":-80.3594970703125},{"lat":25.676186684959895,"lng":-80.30181884765625},{"lat":25.960514139980216,"lng":-80.15625},{"lat":25.888878582127084,"lng":-80.13702392578125},{"lat":25.760319754713887,"lng":-80.15350341796875},{"lat":25.849336891707605,"lng":-80.11505126953125},{"lat":26.014829289931015,"lng":-80.12603759765625},{"lat":26.561506704037942,"lng":-80.07110595703125},{"lat":26.973485432147246,"lng":-80.079345703125},{"lat":27.174025734723248,"lng":-80.2001953125},{"lat":27.174025734723248,"lng":-80.27435302734375},{"lat":27.269278554175017,"lng":-80.2606201171875},{"lat":28.033197847676377,"lng":-80.60394287109375},{"lat":28.697815516328,"lng":-80.8758544921875},{"lat":29.14496502116881,"lng":-81.01318359375},{"lat":29.699982298744377,"lng":-81.2603759765625},{"lat":29.60928222414313,"lng":-81.70257568359375},{"lat":29.88351825335318,"lng":-82.177734375},{"lat":30.099989515377835,"lng":-82.18048095703125},{"lat":29.6880527498568,"lng":-82.45788574218749},{"lat":29.38217507514529,"lng":-81.298828125},{"lat":28.408312587374258,"lng":-80.936279296875},{"lat":27.664068965384516,"lng":-80.60943603515625},{"lat":27.37664535363958,"lng":-80.52429199218749},{"lat":27.249746156836583,"lng":-80.79345703125},{"lat":26.995513469748428,"lng":-81.97723388671875},{"lat":26.58115856768685,"lng":-82.03216552734375},{"lat":26.696545111585127,"lng":-81.74102783203125},{"lat":26.48532391504829,"lng":-81.57623291015625},{"lat":26.382027976025352,"lng":-81.35650634765625},{"lat":25.96792222903405,"lng":-81.54327392578125},{"lat":25.987674852384966,"lng":-81.37847900390625},{"lat":26.4090906208143,"lng":-81.27960205078125},{"lat":27.071354789865012,"lng":-81.54327392578125},{"lat":27.22288351026879,"lng":-80.79071044921875},{"lat":27.073800430911785,"lng":-80.59844970703125},{"lat":26.838776064165888,"lng":-80.584716796875},{"lat":26.69899887737433,"lng":-80.18096923828124},{"lat":26.377106813670053,"lng":-80.21942138671875},{"lat":26.27125116671496,"lng":-80.2880859375},{"lat":26.113519730139533,"lng":-80.364990234375},{"lat":25.928407032694118,"lng":-80.45013427734375}];
var boundsflorida = {"_southWest":{"lat":25.45319497952487,"lng":-82.45788574218749},"_northEast":{"lat":30.099989515377835,"lng":-80.07110595703125}};

function randomPointInBounds(bounds, bbox) {
    var x_min  = bounds._northEast.lng;
    var x_max  = bounds._southWest.lng;
    var y_min  = bounds._southWest.lat;
    var y_max  = bounds._northEast.lat;

    var lat = y_min + (Math.random() * (y_max - y_min));
    var lng = x_min + (Math.random() * (x_max - x_min));


    if (isMarkerInsideBounds({lat: lat,lng: lng},bbox)){
        return [lat,lng];
    } else {
        return randomPointInBounds(bounds,bbox);
    }
}

app.get('/opinions', function (req, res) {
    if(filteredOpinions.statuses[0].coordinates == null && iterOpinion == lbboxsLen-1){
    filteredOpinions.statuses = filteredOpinions.statuses.map(function(tweet){
        tweet.coordinates = randomPointInBounds(boundsflorida,bboxflorida);
        return tweet;
    });
        console.log("Coordinates set.");
    }
    else if(filteredOpinions.statuses[0].coordinates != null && iterOpinion == lbboxsLen-1){
        console.log("Coordinates are already set.");
    }
    else{
        console.log("Opinions data is incomplete");
    }
    res.json(filteredOpinions);
});
app.get('/weather', function (req, res) {
    if(filteredWeather.statuses[0].coordinates == null && iterWeather == lbboxsLen-1){
        filteredWeather.statuses = filteredWeather.statuses.map(function(tweet){
            tweet.coordinates = randomPointInBounds(boundsfloridaAll,bboxfloridaAll);
            return tweet;
        });
        console.log("Coordinates set.");
    }
    else if(filteredWeather.statuses[0].coordinates != null && iterWeather == lbboxsLen-1){
        console.log("Coordinates are already set.");
    }
    else{
        console.log("Weather data is incomplete");
    }
    res.json(filteredWeather);
});
app.get('/crime', function (req, res) {
    if(filteredCrime.statuses[0].coordinates == null && iterCrime == lbboxsLen-1){
        filteredCrime.statuses = filteredCrime.statuses.map(function(tweet){
            tweet.coordinates = randomPointInBounds(boundsfloridaAll,bboxfloridaAll);
            return tweet;
        });
        console.log("Coordinates set.");
    }
    else if(filteredCrime.statuses[0].coordinates != null && iterCrime == lbboxsLen-1){
        console.log("Coordinates are already set.");
    }
    else{
        console.log("Crime data is incomplete");
    }
    res.json(filteredCrime);
});
app.get('/traffic', function (req, res) {
    if(filteredTraffic.statuses[0].coordinates == null && iterTraffic == lbboxsLen-1){
        filteredTraffic.statuses = filteredTraffic.statuses.map(function(tweet){
            tweet.coordinates = randomPointInBounds(boundsfloridaAll,bboxfloridaAll);
            return tweet;
        });
        console.log("Coordinates set.");
    }
    else if(filteredTraffic.statuses[0].coordinates != null && iterTraffic == lbboxsLen-1){
        console.log("Coordinates are already set.");
    }
    else{
        console.log("Traffic data is incomplete");
    }
    res.json(filteredTraffic);
});


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
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
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

app.listen(3000);
console.log("Twit running.");

module.exports = app;

