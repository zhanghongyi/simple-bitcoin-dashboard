
var express = require('express');
var routes = require('./routes');
var path = require('path');
var fs = require('fs');
var http = require('http');
var request = require('request');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(express.cookieParser('your secret here'));
app.use(express.session());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);
app.get('/api', routes.api);

newdata = new Object();

var interval = setInterval( function() {
  update(newdata);
}, 3000);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});

function getDateTime() {
  var date = new Date();
  var hour = date.getHours();
  hour = (hour < 10 ? "0" : "") + hour;
  var min  = date.getMinutes();
  min = (min < 10 ? "0" : "") + min;
  var sec  = date.getSeconds();
  sec = (sec < 10 ? "0" : "") + sec;
  return hour + ":" + min + ":" + sec;
}


function update(newdata) {
	var date = getDateTime();
  newdata.time = date;

  request('https://api.bitcoinaverage.com/ticker/global/CAD/last', function (error, response, body) {
    if (!error && response.statusCode == 200) {
      newdata.CAD = body;
    }
  });

	request('https://api.bitcoinaverage.com/ticker/global/BRL/last', function (error, response, body) {
    if (!error && response.statusCode == 200) {
      newdata.BRL = body;
    }
  });

  var jsonData = JSON.stringify(newdata, null, 2);
  //console.log("json: "+jsonData);
  fs.writeFile('data/data.json', jsonData, function (err) {
    if (err) throw err;
    console.log('Data Updated');
  });
}

