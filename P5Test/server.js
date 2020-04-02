var Datastore = require('nedb');
var db = new Datastore({ filename: "data.db", autoload: true });

var express = require('express');
var app = express();
app.use(express.static('public'));
app.set('view engine', 'ejs');

var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({ extended: true }); // for parsing form data
app.use(urlencodedParser);

app.get('/', function (req, res) {
  res.redirect("/display");
});

app.post('/addData', function (req, res) {

  var data = {
    Person: req.body.person,
    Game: req.body.game
  };

  db.insert(data, function (err, newDocs) {
    console.log("err: " + err);
    console.log("newDocs: " + newDocs);
  });

  res.redirect("/display");
});

app.get('/display', function (req, res) {

  db.find({}).sort({ Person: 1 }).exec(function (err, docs) {
    console.log(docs);
    var datatopass = { data: docs };
    res.render("display.ejs", datatopass);
  });
});

app.get('/data', function (req, res) {
  db.find({}).sort({ Person: 1 }).exec(function (err, docs) {
    console.log(docs);
    res.send({ thedata: docs });
  });
});

app.listen(80, function () { });
