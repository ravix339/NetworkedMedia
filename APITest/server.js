var express = require('express');
var https = require('https');
var config = require('./config.json')
var app = express();
app.use(express.static('public'));

var GeneralOptions = {
    method: 'GET',
    protocol: 'https:',
    hostname: 'ws.detectlanguage.com',
    headers: {
        'Authorization': 'Bearer ' + config.API_KEY
    }
}
var allLanguages = {};

function UpdateLanguages() {
    var options = GeneralOptions;
    options['path'] = '/0.2/languages';
    result = '{"data":';

    var idk = https.request(options, (response) => {
        console.log("Updating Language Base");
        response.setEncoding('utf8');
        const status = response.statusCode;
        if (status != 200) {
            response.resume();
            return;
        }
        var total = ""
        response.on('data', (chunk) => {
            total += chunk;
        })
        response.on('end', () => {
            result += total + "}";
            console.log(result);
            result = JSON.parse(result).data;
            allLanguages = {};
            for (var i = 0; i < result.length; i++) {
                var split = result[i].name.split('_');
                formatted = "";
                for (var wordIndex = 0; wordIndex < split.length; wordIndex++) {
                    formatted += split[wordIndex][0];
                    for (var ch = 1; ch < split[wordIndex].length; ch++) {
                        formatted += split[wordIndex][ch].toLowerCase();
                    }
                    if (wordIndex < split.length - 1) {
                        formatted += " ";
                    }
                }
                allLanguages[result[i].code] = formatted;
            }
            console.log(allLanguages);
        })
    }).end();
}
UpdateLanguages();
setTimeout(UpdateLanguages, 5 * 60 * 1000);

app.get('/', function (req, res) {
    res.send("hello");
});

app.get('/search', async function (req, res) {
    var input = req.query.text;
    if (!input) {
        res.send('{Msg: "Error"');
    }
    else {
        var options = GeneralOptions;
        options['path'] = '/0.2/detect?q=' + encodeURI(req.query.text);

        var result = "";
        https.request(options, (response) => {
            response.setEncoding('utf8');
            const status = response.statusCode;
            if (status != 200) {
                response.resume();
                res.send("");
                return;
            }

            var total = ""

            response.on('data', (chunk) => {
                total += chunk;
            })

            response.on('end', () => {
                result = JSON.parse(total).data;
                for (var i = 0; i < result.detections.length; i++) {
                    result.detections[i].language = allLanguages[result.detections[i].language];
                }
                res.send(result);
            })

        }).end();
    }
});

app.listen(80, function () { });