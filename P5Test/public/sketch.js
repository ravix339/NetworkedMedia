//let data = [{"person":"aidan","faceloc":"chin","timestamp":1585240941820,"_id":"8ZFR41bEreEDFrSM"},{"person":"shawn","faceloc":"nose","timestamp":1585240950135,"_id":"QFBB1NqH02X4aRgR"},{"person":"shawn","faceloc":"nose","timestamp":1585240956749,"_id":"GKCuYcPSI6luG5vc"},{"person":"ty","faceloc":"forehead","timestamp":1585240964974,"_id":"VtWaC9nM4MTPrvLq"}];
let data = [];
let PersonDict = [];
// [{"person": "shawn", "touches": 0},
// {"person": "aidan", "touches": 1}]

function loadData() {
	fetch('/data')
		.then((response) => {
			console.log(response);
			return response.json();
		})
		.then((incoming) => {
			console.log("*****");
			console.log(incoming);
			data = incoming.thedata;
			parseData();
			console.log(PersonDict);
		});
	setTimeout(loadData, 5000);
}

function parseData() {
	PersonDict = [];
	function filt() { //Remove duplicate entries
		ret = [];
		for (var i = 0; i < data.length; i++) {
			var flag = false;
			for (var j = 0; j < ret.length; j++) {
				if (ret[j].Person == data[i].Person && ret[j].Game == data[i].Game) {
					flag = true;
					break;
				}
			}
			if (!flag) {
				ret.push(data[i]);
			}
		}
		return ret;
	}

	var temp = filt();

	for (var i = 0; i < temp.length; i++) {
		var flag = false;
		for (var j = 0; j < PersonDict.length; j++) {
			if (PersonDict[j].Person == temp[i].Person) {
				PersonDict[j].Count++;
				flag = true;
				break;
			}
		}
		if (!flag) {
			PersonDict.push({ "Person": temp[i].Person, "Count": 1 });
		}
	}
}

function drawPerson() {
    var scale = 30;
    var maxCount = 0;
    for (var i = 0; i < PersonDict.length; i++) {
        if (PersonDict[i].Count > maxCount) { maxCount = PersonDict[i].Count; }
    }

    for (var i = 0; i < PersonDict.length; i++) {
        text(PersonDict[i].Person, i * 60 + 60, 350);
        rect(i * 60 + 60, (300 - PersonDict[i].Count * scale), 20, PersonDict[i].Count * scale)
    }

    for (var k = 0; k <= maxCount; k++) {
        text(k, 10, 300 - k * scale);
    }
}

function setup() {
	createCanvas(1200, 400);
	loadData();
	frameRate(2);
}

function draw() {
	background(255);
    for (var i = 0; i < 400; i++) {
        var radius = 200;
        let h = random(0, 360);
        fill(h, 90, 90);
    }
	drawPerson();
}
