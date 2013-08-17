var express = require('express');

var oneDay = 86400000;

var app = express();

app.use(express.static(__dirname + '/', { maxAge: oneDay }))

var port = process.env.PORT || 5000;
app.listen(port, function() {
  console.log("Listening on " + port);
});