var express = require('express');
var app = express();
var gm = require('gm').subClass({ imageMagick: true }); //Try to remove if possible
var multer = require('multer');
var fs = require('fs');
var parseString = require('xml2js').parseString;
var memedown = require('./memedown.js').methods;

var storage = multer.memoryStorage()
var upload = multer({ storage: storage })

app.use(express.static('public'));

memedown.loadFonts();

app.post('/process', upload.any(), async function (req, res) {
    var code = req.body.code;
    var imdata = req.files[0].buffer;
    gm(imdata).size(function (err, size) {
        if (!err) {
            parseString(code, function (err, result) {
                var textData = memedown.validateAndSeparate(result);
                if (textData.err) {
                    console.log(textData.err);
                }
                else {
                    var result = memedown.drawCanvas(textData.data, imdata, size.width, size.height);
                    res.send({ data: result.toDataURL() });
                }
            });
        }
        else {
            console.log(err);
        }
    });
});

app.get('/', function (req, res) {
    res.send("hello");
});

app.listen(8080, function () { });